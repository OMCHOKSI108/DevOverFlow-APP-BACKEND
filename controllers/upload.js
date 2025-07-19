const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Configure Cloudinary at the top
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// We don't need Multer in this controller anymore, we will process the raw buffer
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

const bufferToDataURI = (fileFormat, buffer) => parser.format(fileFormat, buffer).content;

const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        const dataUri = bufferToDataURI(path.extname(file.originalname).toString(), file.buffer);
        cloudinary.uploader.upload(dataUri, { folder: folder }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// @desc    Get upload configuration
// @route   GET /api/upload/config
exports.getUploadConfig = asyncHandler(async (req, res, next) => {
    res.status(200).json({ 
        success: true, 
        data: {
            uploadEnabled: true,
            maxFileSize: parseInt(process.env.MAX_FILE_SIZE),
            allowedTypes: process.env.ALLOWED_TYPES.split(','),
        }
    });
});

// @desc    Upload a single file to Cloudinary
// @route   POST /api/upload/single
exports.uploadSingleFile = asyncHandler(async (req, res, next) => {
    // This requires a middleware to handle multipart form data first,
    // which will attach the file to req.file. Let's create it in routes/upload.js
    if (!req.file) {
      return next(new ErrorResponse('Please select a file to upload.', 400));
    }
    const result = await uploadToCloudinary(req.file, 'devoverflow_uploads');
    res.status(201).json({ success: true, fileUrl: result.secure_url });
});

// @desc    Upload a user profile picture
// @route   POST /api/upload/profile
exports.uploadProfileImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please select a file to upload.', 400));
    }
    const result = await uploadToCloudinary(req.file, 'devoverflow_profiles');
    
    // Update the user's profilePicture field in the database
    await User.findByIdAndUpdate(req.user.id, { profilePicture: result.secure_url });
    
    res.status(201).json({ success: true, fileUrl: result.secure_url });
});