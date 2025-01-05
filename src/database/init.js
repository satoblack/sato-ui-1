const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı bağlantısını oluştur
const dbPath = path.join(__dirname, 'profile.db');
const db = new sqlite3.Database(dbPath);

// Tabloları oluştur
db.serialize(() => {
    // Profil tablosu
    db.run(`
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // RTMP tablosu
    db.run(`
        CREATE TABLE IF NOT EXISTS rtmp_streams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            stream_key TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
        )
    `);

    // Medya dosyaları tablosu
    db.run(`
        CREATE TABLE IF NOT EXISTS media_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER NOT NULL,
            file_type TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
        )
    `);
});

// Veritabanı bağlantısını kapat
db.close((err) => {
    if (err) {
        console.error('Veritabanı kapatılırken hata:', err.message);
    } else {
        console.log('Veritabanı başarıyla oluşturuldu ve kapatıldı.');
    }
}); 