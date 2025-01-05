const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pino = require('pino');

// Logger yapılandırması
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

const app = express();
const port = 3001;

// CORS ayarlarını güncelle
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Her istek için log middleware'i
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
        ip: req.ip
    }, 'Gelen İstek');

    // Yanıt süresini hesapla
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`
        }, 'Giden Yanıt');
    });

    next();
});

// Uploads klasörlerini oluştur
const uploadDirs = ['uploads/audio', 'uploads/video'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`Klasör oluşturuldu: ${dir}`);
    }
});

// Multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.mimetype.startsWith('audio/') ? 'audio' : 'video';
        cb(null, `uploads/${fileType}`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
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
    }
});

// Routes
const profileRoutes = require('./routes/profile.cjs');
const rtmpRoutes = require('./routes/rtmp.cjs');
const { router: mediaRoutes } = require('./routes/media.cjs');

app.use('/api/profile', profileRoutes);
app.use('/api/rtmp', rtmpRoutes);
app.use('/api/media', mediaRoutes);

// Hata yakalama middleware
app.use((err, req, res, next) => {
    logger.error({
        err: {
            message: err.message,
            stack: err.stack
        },
        method: req.method,
        url: req.url,
        body: req.body
    }, 'Sunucu Hatası');
    
    res.status(500).json({ error: err.message || 'Bir hata oluştu!' });
});

app.listen(port, () => {
    logger.info(`Sunucu http://localhost:${port} adresinde çalışıyor`);
}); 