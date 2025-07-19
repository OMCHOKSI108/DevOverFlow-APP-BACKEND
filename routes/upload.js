const express = require('express');
const multer = require('multer');
const { getUploadConfig, uploadSingleFile, uploadProfileImage } = require('../controllers/upload');
const { protect } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const router = express.Router();

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) },
    fileFilter: (req, file, cb) => {
        const allowed = process.env.ALLOWED_TYPES.split(',');
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ErrorResponse(`File type not allowed. Allowed: ${process.env.ALLOWED_TYPES}`, 400), false);
        }
    }
});


// Apply middleware chain
router.get('/config', protect, getUploadConfig);
router.post('/single', protect, upload.single('file'), uploadSingleFile);
router.post('/profile', protect, upload.single('file'), uploadProfileImage);

module.exports = router;