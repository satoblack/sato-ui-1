const express = require('express');
const router = express.Router();
const db = require('../database/db.cjs');
const { cleanupRtmpMedia } = require('./media.cjs');
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

// RTMP listesi
router.get('/profile/:profileId', async (req, res) => {
    try {
        const { profileId } = req.params;
        logger.info({ profileId }, 'RTMP listesi isteği');

        const rtmpStreams = await db.allAsync(
            `SELECT r.*, 
                r.service_type as icon,
                v.file_path as video_path, v.file_name as video_name,
                a.file_path as audio_path, a.file_name as audio_name
            FROM rtmp_streams r
            LEFT JOIN media_files v ON r.video_file_id = v.id
            LEFT JOIN media_files a ON r.audio_file_id = a.id
            WHERE r.profile_id = ?
            ORDER BY r.created_at DESC`,
            [profileId]
        );

        logger.info({ count: rtmpStreams.length }, 'RTMP listesi getirildi');
        res.json(rtmpStreams);
    } catch (err) {
        logger.error({ err }, 'RTMP listesi alınırken hata');
        res.status(500).json({ error: 'RTMP listesi alınamadı' });
    }
});

// RTMP ekleme
router.post('/', async (req, res) => {
    try {
        const { profile_id, name, url, icon, video_file_id, audio_file_id, is_active } = req.body;
        logger.info({ profile_id, name, icon }, 'RTMP ekleme isteği');

        if (!profile_id || !name || !url || !icon) {
            logger.warn('Eksik bilgi', { profile_id, name, url, icon });
            return res.status(400).json({ error: 'Eksik bilgi' });
        }

        const result = await db.runAsync(
            `INSERT INTO rtmp_streams (
                profile_id, name, url, service_type, 
                video_file_id, audio_file_id, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [profile_id, name, url, icon, video_file_id || null, audio_file_id || null, is_active || false]
        );

        const newRtmp = await db.getAsync(
            `SELECT r.*, 
                r.service_type as icon,
                v.file_path as video_path, v.file_name as video_name,
                a.file_path as audio_path, a.file_name as audio_name
            FROM rtmp_streams r
            LEFT JOIN media_files v ON r.video_file_id = v.id
            LEFT JOIN media_files a ON r.audio_file_id = a.id
            WHERE r.id = ?`,
            [result.lastID]
        );

        logger.info({ rtmp: newRtmp }, 'RTMP başarıyla eklendi');
        res.json(newRtmp);
    } catch (err) {
        logger.error({ err }, 'RTMP eklenirken hata');
        res.status(500).json({ error: 'RTMP eklenemedi' });
    }
});

// RTMP güncelleme
router.put('/:id', async (req, res) => {
    try {
        const { name, url, icon, video_file_id, audio_file_id, is_active } = req.body;
        const { id } = req.params;
        
        logger.info({ id, name, icon }, 'RTMP güncelleme isteği');

        // Mevcut RTMP'yi kontrol et
        const existingRtmp = await db.getAsync('SELECT * FROM rtmp_streams WHERE id = ?', [id]);
        if (!existingRtmp) {
            logger.warn({ id }, 'RTMP bulunamadı');
            return res.status(404).json({ error: 'RTMP bulunamadı' });
        }

        // Güncelleme sorgusunu hazırla
        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name);
        }
        if (url !== undefined) {
            updates.push('url = ?');
            values.push(url);
        }
        if (icon !== undefined) {
            updates.push('service_type = ?');
            values.push(icon);
        }
        if (video_file_id !== undefined) {
            updates.push('video_file_id = ?');
            values.push(video_file_id);
        }
        if (audio_file_id !== undefined) {
            updates.push('audio_file_id = ?');
            values.push(audio_file_id);
        }
        if (is_active !== undefined) {
            updates.push('is_active = ?');
            values.push(is_active);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        // Güncelleme sorgusu
        await db.runAsync(
            `UPDATE rtmp_streams SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        // Güncellenmiş RTMP'yi al
        const updatedRtmp = await db.getAsync(
            `SELECT r.*, 
                r.service_type as icon,
                v.file_path as video_path, v.file_name as video_name,
                a.file_path as audio_path, a.file_name as audio_name
            FROM rtmp_streams r
            LEFT JOIN media_files v ON r.video_file_id = v.id
            LEFT JOIN media_files a ON r.audio_file_id = a.id
            WHERE r.id = ?`,
            [id]
        );

        logger.info({ rtmp: updatedRtmp }, 'RTMP başarıyla güncellendi');
        res.json(updatedRtmp);
    } catch (err) {
        logger.error({ err }, 'RTMP güncellenirken hata');
        res.status(500).json({ error: 'RTMP güncellenemedi' });
    }
});

// RTMP silme
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        logger.info({ id }, 'RTMP silme isteği');

        // Önce RTMP'yi kontrol et
        const rtmp = await db.getAsync(
            'SELECT id, video_file_id, audio_file_id FROM rtmp_streams WHERE id = ?',
            [id]
        );

        if (!rtmp) {
            logger.warn({ id }, 'RTMP bulunamadı');
            return res.status(404).json({ error: 'RTMP bulunamadı' });
        }

        // Medya dosyalarını temizle
        await cleanupRtmpMedia(id);
        logger.info({ id }, 'RTMP medya dosyaları temizlendi');

        // RTMP'yi sil
        await db.runAsync('DELETE FROM rtmp_streams WHERE id = ?', [id]);
        logger.info({ id }, 'RTMP başarıyla silindi');

        res.json({ message: 'RTMP ve ilişkili medya dosyaları başarıyla silindi' });
    } catch (err) {
        logger.error({ err }, 'RTMP silinirken hata');
        res.status(500).json({ error: 'RTMP silinemedi' });
    }
});

module.exports = router; 