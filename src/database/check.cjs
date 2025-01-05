const db = require('./db.cjs');

async function checkDatabase() {
    try {
        // RTMP kayıtlarını kontrol et
        console.log('\nRTMP Kayıtları:');
        const rtmpStreams = await db.allAsync('SELECT * FROM rtmp_streams');
        console.log(rtmpStreams);

        // Medya dosyalarını kontrol et
        console.log('\nMedya Dosyaları:');
        const mediaFiles = await db.allAsync('SELECT * FROM media_files');
        console.log(mediaFiles);

        // Profilleri kontrol et
        console.log('\nProfiller:');
        const profiles = await db.allAsync('SELECT * FROM profiles');
        console.log(profiles);

        process.exit(0);
    } catch (err) {
        console.error('Hata:', err);
        process.exit(1);
    }
}

checkDatabase(); 