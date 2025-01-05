const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('../database/db.cjs');
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

// Multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.mimetype.startsWith('audio/') ? 'audio' : 'video';
        const dir = `uploads/${fileType}`;
        
        // Klasör yoksa oluştur
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            logger.info(`Klasör oluşturuldu: ${dir}`);
        }
        
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Dosya adını hash ile oluştur
        const fileHash = crypto.createHash('sha256')
            .update(file.originalname + Date.now())
            .digest('hex');
        
        const ext = path.extname(file.originalname);
        cb(null, `${fileHash}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece ses ve video dosyaları yüklenebilir!'));
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 500 // 500MB limit
    }
});

// Dosya silme fonksiyonu
const deleteFile = async (fileId) => {
    try {
        const file = await db.getAsync(
            'SELECT * FROM media_files WHERE id = ?',
            [fileId]
        );

        if (!file) return;

        // Fiziksel dosyayı sil
        if (file.file_path && fs.existsSync(file.file_path)) {
            fs.unlinkSync(file.file_path);
            logger.info(`Fiziksel dosya silindi: ${file.file_path}`);
        }
        
        // Veritabanı kaydını sil
        await db.runAsync('DELETE FROM media_files WHERE id = ?', [fileId]);
        logger.info(`Medya kaydı silindi: ID ${fileId}`);
    } catch (err) {
        logger.error({ err }, 'Dosya silme hatası');
        throw err;
    }
};

// RTMP için medya dosyalarını temizle
const cleanupRtmpMedia = async (rtmpId) => {
    try {
        // RTMP'nin kullandığı medya dosyalarını bul
        const rtmp = await db.getAsync(
            'SELECT video_file_id, audio_file_id FROM rtmp_streams WHERE id = ?',
            [rtmpId]
        );

        if (rtmp) {
            // Video dosyasını temizle
            if (rtmp.video_file_id) {
                await deleteFile(rtmp.video_file_id);
            }

            // Ses dosyasını temizle
            if (rtmp.audio_file_id) {
                await deleteFile(rtmp.audio_file_id);
            }
        }
    } catch (err) {
        logger.error({ err }, 'RTMP medya temizleme hatası');
        throw err;
    }
};

// Profil için medya dosyalarını temizle
const cleanupProfileMedia = async (profileId) => {
    try {
        const files = await db.allAsync('SELECT id FROM media_files WHERE profile_id = ?', [profileId]);
        for (const file of files) {
            await deleteFile(file.id);
        }
    } catch (err) {
        logger.error({ err }, 'Profil medya temizleme hatası');
        throw err;
    }
};

// Hash kontrolü endpoint'i
router.post('/check-hash', async (req, res) => {
    try {
        const { hash, fileType } = req.body;
        logger.info({ hash, fileType }, 'Hash kontrolü isteği');

        if (!hash || !fileType) {
            logger.warn('Hash veya fileType eksik');
            return res.status(400).json({ error: 'Hash ve fileType gerekli!' });
        }

        // Hash'e göre dosya kontrolü
        const file = await db.getAsync(
            'SELECT * FROM media_files WHERE file_hash = ? AND file_type = ?',
            [hash, fileType]
        );

        if (file) {
            logger.info({ file }, 'Eşleşen dosya bulundu');
            res.json({ exists: true, file });
        } else {
            logger.info('Eşleşen dosya bulunamadı');
            res.json({ exists: false });
        }
    } catch (err) {
        logger.error({ err }, 'Hash kontrolü hatası');
        res.status(500).json({ error: 'Hash kontrolü yapılamadı!' });
    }
});

// Profil bazlı medya yükleme endpoint'i
router.post('/upload/:profileId', upload.single('file'), async (req, res) => {
    try {
        const { profileId } = req.params;
        const { fileHash } = req.body; // Frontend'den gelen hash
        logger.info({ profileId, fileHash }, 'Dosya yükleme isteği');

        if (!req.file) {
            logger.warn('Dosya yüklenmedi');
            return res.status(400).json({ error: 'Dosya yüklenmedi!' });
        }

        // Profil kontrolü
        const profile = await db.getAsync('SELECT id FROM profiles WHERE id = ?', [profileId]);
        if (!profile) {
            logger.warn({ profileId }, 'Profil bulunamadı');
            return res.status(404).json({ error: 'Profil bulunamadı!' });
        }

        const fileType = req.file.mimetype.startsWith('audio/') ? 'audio' : 'video';
        
        // Dosya boyutu ve hash hesapla
        const stats = fs.statSync(req.file.path);
        const calculatedHash = crypto.createHash('sha256')
            .update(fs.readFileSync(req.file.path))
            .digest('hex');

        // Hash kontrolü
        if (fileHash && fileHash !== calculatedHash) {
            logger.warn({ fileHash, calculatedHash }, 'Hash uyuşmazlığı');
            fs.unlinkSync(req.file.path); // Geçici dosyayı sil
            return res.status(400).json({ error: 'Dosya hash değeri uyuşmuyor!' });
        }

        const result = await db.runAsync(
            `INSERT INTO media_files (
                profile_id, file_type, file_name, file_path, 
                file_hash, mime_type, size_bytes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                profileId,
                fileType,
                req.file.originalname,
                req.file.path,
                calculatedHash,
                req.file.mimetype,
                stats.size
            ]
        );

        const newFile = {
            id: result.lastID,
            file_name: req.file.originalname,
            file_path: req.file.path,
            file_type: fileType,
            file_hash: calculatedHash,
            size_bytes: stats.size
        };
        logger.info({ file: newFile }, 'Dosya başarıyla yüklendi');

        res.status(201).json(newFile);
    } catch (err) {
        // Hata durumunda dosyayı temizle
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        logger.error({ err }, 'Dosya yükleme hatası');
        res.status(500).json({ error: 'Dosya yüklenemedi!' });
    }
});

// Profil bazlı medya listeleme endpoint'i
router.get('/profile/:profileId', async (req, res) => {
    try {
        const { profileId } = req.params;
        logger.info({ profileId }, 'Profil medya listesi isteği');

        const files = await db.allAsync(
            'SELECT * FROM media_files WHERE profile_id = ? ORDER BY created_at DESC',
            [profileId]
        );

        logger.info({ count: files.length }, 'Medya dosyaları listelendi');
        res.json(files);
    } catch (err) {
        logger.error({ err }, 'Medya listeleme hatası');
        res.status(500).json({ error: 'Medya dosyaları listelenemedi!' });
    }
});

// Medya silme endpoint'i
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        logger.info({ id }, 'Dosya silme isteği');

        await deleteFile(id);
        logger.info({ id }, 'Dosya başarıyla silindi');
        
        res.json({ message: 'Medya dosyası başarıyla silindi!' });
    } catch (err) {
        logger.error({ err }, 'Medya silme hatası');
        res.status(500).json({ error: 'Medya dosyası silinemedi!' });
    }
});

module.exports = { router, cleanupRtmpMedia, cleanupProfileMedia }; 