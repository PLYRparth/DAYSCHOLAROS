const multer = require('multer');
const { computeFileHash } = require('../utils/fileHash');
const { processAndSaveImage } = require('../utils/imageProcessor');
const fs = require('fs').promises;
const path = require('path');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB hard limit per file
});

exports.uploadSingle = upload.single('file');

exports.validateAndProcessUpload = async (req, res, next) => {
  if (!req.file) return next();

  const buffer = req.file.buffer;

  try {
    // 1. Validate file type from raw bytes (bypassing potentially spoofed Content-Type headers)
    const { fileTypeFromBuffer } = await import('file-type');
    const type = await fileTypeFromBuffer(buffer);

    if (!type || !['application/pdf', 'image/jpeg', 'image/png'].includes(type.mime)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid file type. Only PDF, JPEG, and PNG are allowed.' });
    }

    // 2. Storage quota check (200MB limit)
    const MAX_QUOTA = 200 * 1024 * 1024;
    const user = await User.findById(req.user.id);
    
    if (user.storageQuotaUsed + req.file.size > MAX_QUOTA) {
      return res.status(400).json({ status: 'fail', message: 'Storage quota exceeded (200MB limit).' });
    }

    // 3. Compute Hash
    const fileHash = computeFileHash(buffer);
    req.file.fileHash = fileHash;

    // 4. Deduplication for Study Material
    if (req.baseUrl.includes('study-materials') || req.originalUrl.includes('study-materials')) {
      const existingMaterial = await StudyMaterial.findOne({ fileHash });
      if (existingMaterial) {
        req.file.file_url = existingMaterial.file_url;
        req.file.isDuplicate = true;
        // Skip saving file and skip deducting quota for duplicates
        return next();
      }
    }

    // 5. Process and Save File
    const uploadsDir = path.join(__dirname, '../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = type.ext === 'pdf' ? 'pdf' : 'jpg'; // Convert all images to jpg
    const filename = `${req.user.id}-${Date.now()}-${fileHash.substring(0, 8)}.${ext}`;
    const uploadPath = path.join(uploadsDir, filename);

    if (type.mime.startsWith('image/')) {
      await processAndSaveImage(buffer, filename);
    } else {
      await fs.writeFile(uploadPath, buffer);
    }

    // 6. Update user storage quota
    user.storageQuotaUsed += req.file.size;
    await user.save({ validateBeforeSave: false });

    // 7. Attach URL to request for controller to use
    req.file.file_url = `/uploads/${filename}`;
    next();
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ status: 'error', message: 'File processing failed', error: err.message });
  }
};
