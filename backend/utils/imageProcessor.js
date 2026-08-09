const sharp = require('sharp');
const path = require('path');

exports.processAndSaveImage = async (buffer, filename) => {
  const outputPath = path.join(__dirname, '../uploads', filename);
  // sharp automatically strips EXIF metadata unless withMetadata() is called
  await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }) // Resize/compress
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(outputPath);
  return outputPath;
};
