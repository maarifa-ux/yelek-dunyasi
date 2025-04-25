const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Oluşturulacak logoyu yapılandır
const width = 512;
const height = 512;
const backgroundColor = '#3498db'; // Mavi arka plan
const outputPath = path.join(__dirname, '..', 'assets', 'logo.png');

// Dosya yolunun var olduğundan emin ol
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, {recursive: true});
}

// Belirtilen boyutlarda ve renkte bir logo oluştur
sharp({
  create: {
    width,
    height,
    channels: 4,
    background: backgroundColor,
  },
})
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log(`Logo başarıyla oluşturuldu: ${outputPath}`);
  })
  .catch(err => {
    console.error('Logo oluşturulurken hata oluştu:', err);
  });
