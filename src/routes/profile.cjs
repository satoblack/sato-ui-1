const express = require('express');
const router = express.Router();
const db = require('../database/db.cjs');
const fs = require('fs');
const path = require('path');
const { cleanupProfileMedia } = require('./media.cjs');
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

// Profil için tüm medya dosyalarını silme
const deleteProfileMediaFiles = async (profileId) => {
    try {
        const files = await db.allAsync('SELECT * FROM media_files WHERE profile_id = ?', [profileId]);
        for (const file of files) {
            if (file.file_path && fs.existsSync(file.file_path)) {
                fs.unlinkSync(file.file_path);
                logger.info(`Medya dosyası silindi: ${file.file_path}`);
            }
        }
    } catch (err) {
        logger.error({ err }, 'Profil medya dosyaları silinirken hata');
    }
};

// Tüm profilleri getir
router.get('/', async (req, res, next) => {
    try {
        logger.info('Tüm profiller isteniyor...');
        logger.debug('SQL Sorgusu: SELECT * FROM profiles');

        const profiles = await db.allAsync('SELECT * FROM profiles');
        
        logger.info({ profiles }, 'Profiller başarıyla getirildi');
        res.json(profiles);
    } catch (err) {
        logger.error({ err }, 'Profiller getirilirken hata');
        next(err);
    }
});

// Profil oluştur
router.post('/', async (req, res, next) => {
    try {
        const { username } = req.body;
        logger.info({ username }, 'Yeni profil oluşturma isteği');

        if (!username) {
            logger.warn('Username eksik');
            return res.status(400).json({ error: 'Username gerekli!' });
        }

        logger.debug({
            query: 'INSERT INTO profiles (username) VALUES (?)',
            params: [username]
        }, 'Profil ekleme sorgusu');

        const result = await db.runAsync(
            'INSERT INTO profiles (username) VALUES (?)',
            [username]
        );

        const newProfile = {
            id: result.lastID,
            username
        };
        logger.info({ profile: newProfile }, 'Yeni profil oluşturuldu');
        
        res.status(201).json(newProfile);
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            logger.warn({ username: req.body.username }, 'Kullanıcı adı zaten kullanımda');
            return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanılıyor!' });
        }
        logger.error({ err }, 'Profil oluşturulurken hata');
        next(err);
    }
});

// Profil güncelle
router.put('/:id', async (req, res, next) => {
    try {
        const { username } = req.body;
        const { id } = req.params;
        
        logger.info({ id, username }, 'Profil güncelleme isteği');

        if (!username) {
            logger.warn('Username eksik');
            return res.status(400).json({ error: 'Username gerekli!' });
        }

        const result = await db.runAsync(
            'UPDATE profiles SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [username, id]
        );

        if (result.changes === 0) {
            logger.warn({ id }, 'Güncellenecek profil bulunamadı');
            return res.status(404).json({ error: 'Profil bulunamadı!' });
        }

        const updatedProfile = {
            id: parseInt(id),
            username
        };
        logger.info({ profile: updatedProfile }, 'Profil güncellendi');

        res.json(updatedProfile);
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            logger.warn({ username: req.body.username }, 'Kullanıcı adı zaten kullanımda');
            return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanılıyor!' });
        }
        logger.error({ err }, 'Profil güncellenirken hata');
        next(err);
    }
});

// Profil sil
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        logger.info({ id }, 'Profil silme isteği');

        // Önce profili kontrol et
        const profile = await db.getAsync('SELECT id FROM profiles WHERE id = ?', [id]);
        if (!profile) {
            logger.warn({ id }, 'Silinecek profil bulunamadı');
            return res.status(404).json({ error: 'Profil bulunamadı!' });
        }

        // İlişkili medya dosyalarını temizle
        await cleanupProfileMedia(id);
        logger.info({ id }, 'Profil medya dosyaları temizlendi');

        // Profili sil (cascade ile ilişkili RTMP kayıtları da silinecek)
        await db.runAsync('DELETE FROM profiles WHERE id = ?', [id]);
        logger.info({ id }, 'Profil silindi');

        res.json({ message: 'Profil ve ilişkili tüm veriler başarıyla silindi!' });
    } catch (err) {
        logger.error({ err }, 'Profil silinirken hata');
        next(err);
    }
});

module.exports = router; 