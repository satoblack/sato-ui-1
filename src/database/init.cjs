const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const pino = require('pino');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});

const dbPath = path.join(__dirname, 'profile.db');
logger.info({ dbPath }, 'Veritabanı yolu');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        logger.error({ err }, 'Veritabanına bağlanırken hata');
        return;
    }
    logger.info('Veritabanına başarıyla bağlanıldı');
});

// Tabloları temizle ve yeniden oluştur
db.serialize(() => {
    // Önce mevcut tabloları sil
    db.run(`DROP TABLE IF EXISTS rtmp_streams`, (err) => {
        if (err) {
            logger.error({ err }, 'RTMP streams tablosu silinirken hata');
        } else {
            logger.info('RTMP streams tablosu silindi');
        }
    });

    db.run(`DROP TABLE IF EXISTS media_files`, (err) => {
        if (err) {
            logger.error({ err }, 'Media files tablosu silinirken hata');
        } else {
            logger.info('Media files tablosu silindi');
        }
    });

    db.run(`DROP TABLE IF EXISTS profiles`, (err) => {
        if (err) {
            logger.error({ err }, 'Profiles tablosu silinirken hata');
        } else {
            logger.info('Profiles tablosu silindi');
        }
    });

    // Profiles tablosu
    db.run(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            logger.error({ err }, 'Profiles tablosu oluşturulurken hata');
        } else {
            logger.info('Profiles tablosu durumu: Mevcut');
        }
    });

    // Media files tablosu - Hem video hem ses dosyaları için
    db.run(`CREATE TABLE IF NOT EXISTS media_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        file_type TEXT NOT NULL CHECK (file_type IN ('audio', 'video')),
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_hash TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER,
        duration_seconds INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            logger.error({ err }, 'Media files tablosu oluşturulurken hata');
        } else {
            logger.info('Media files tablosu durumu: Mevcut');
        }
    });

    // RTMP streams tablosu
    db.run(`CREATE TABLE IF NOT EXISTS rtmp_streams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        service_type TEXT NOT NULL,
        url TEXT NOT NULL,
        video_file_id INTEGER,
        audio_file_id INTEGER,
        is_active BOOLEAN DEFAULT 0,
        last_stream_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (video_file_id) REFERENCES media_files(id) ON DELETE SET NULL,
        FOREIGN KEY (audio_file_id) REFERENCES media_files(id) ON DELETE SET NULL
    )`, (err) => {
        if (err) {
            logger.error({ err }, 'RTMP streams tablosu oluşturulurken hata');
        } else {
            logger.info('RTMP streams tablosu durumu: Mevcut');
        }
    });

    // Trigger'lar
    db.run(`CREATE TRIGGER IF NOT EXISTS check_video_file_type
        BEFORE INSERT ON rtmp_streams
        WHEN NEW.video_file_id IS NOT NULL
        BEGIN
            SELECT CASE
                WHEN NOT EXISTS (SELECT 1 FROM media_files WHERE id = NEW.video_file_id AND file_type = 'video')
                THEN RAISE(ABORT, 'Video dosyası geçersiz!')
            END;
        END;
    `);

    db.run(`CREATE TRIGGER IF NOT EXISTS check_audio_file_type
        BEFORE INSERT ON rtmp_streams
        WHEN NEW.audio_file_id IS NOT NULL
        BEGIN
            SELECT CASE
                WHEN NOT EXISTS (SELECT 1 FROM media_files WHERE id = NEW.audio_file_id AND file_type = 'audio')
                THEN RAISE(ABORT, 'Ses dosyası geçersiz!')
            END;
        END;
    `);

    db.run(`CREATE TRIGGER IF NOT EXISTS check_video_file_type_update
        BEFORE UPDATE OF video_file_id ON rtmp_streams
        WHEN NEW.video_file_id IS NOT NULL
        BEGIN
            SELECT CASE
                WHEN NOT EXISTS (SELECT 1 FROM media_files WHERE id = NEW.video_file_id AND file_type = 'video')
                THEN RAISE(ABORT, 'Video dosyası geçersiz!')
            END;
        END;
    `);

    db.run(`CREATE TRIGGER IF NOT EXISTS check_audio_file_type_update
        BEFORE UPDATE OF audio_file_id ON rtmp_streams
        WHEN NEW.audio_file_id IS NOT NULL
        BEGIN
            SELECT CASE
                WHEN NOT EXISTS (SELECT 1 FROM media_files WHERE id = NEW.audio_file_id AND file_type = 'audio')
                THEN RAISE(ABORT, 'Ses dosyası geçersiz!')
            END;
        END;
    `);

    // İndeksler
    db.run(`CREATE INDEX IF NOT EXISTS idx_media_files_profile_id ON media_files(profile_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_media_files_file_hash ON media_files(file_hash)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_rtmp_streams_profile_id ON rtmp_streams(profile_id)`);
});

// Veritabanı bağlantısını kapat
db.close((err) => {
    if (err) {
        logger.error({ err }, 'Veritabanı kapatılırken hata');
        return;
    }
    logger.info('Veritabanı başarıyla kapatıldı');
}); 