const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendMail = require('../utils/sendMail');

// --- Helper Functions ---

// Creates and sends a JWT token in the response
const sendTokenResponse = (user, statusCode, res, endpoint = '/api/auth/login') => {
    const token = user.getSignedJwtToken();
    const userResponse = { _id: user._id, name: user.name, lastname: user.lastname, email: user.email, role: user.role, profilePicture: user.profilePicture };
    res.status(statusCode).json({
        success: true,
        token,
        user: userResponse,
        endpoint
    });
};

// Returns a formatted HTML string for the verification email
const getVerificationEmailTemplate = (name, url) => `
  <div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h1 style="color: #4A90E2;">Welcome to DevOverflow!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for joining DevOverflow, the ultimate Q&A platform for developers.</p>
    <p>Please verify your email address by clicking the big blue button below. This link is valid for 1 hour.</p>
    <a href="${url}" style="background-color: #4A90E2; color: #fff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Verify My Email</a>
    <p style="margin-top: 20px;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
    <p><a href="${url}">${url}</a></p>
    <p>Best regards,<br>The DevOverflow Team</p>
  </div>
`;

// Returns a formatted HTML string for the password reset email
const getPasswordResetEmailTemplate = (name, url) => `
  <div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h1 style="color: #4A90E2;">Password Reset Request</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your DevOverflow password. No problem!</p>
    <p>Click the button below to set a new password. This link is valid for 1 hour.</p>
    <a href="${url}" style="background-color: #4A90E2; color: #fff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Reset My Password</a>
    <p style="margin-top: 20px;">If you didn't request this change, you can safely ignore this email.</p>
    <p>Best regards,<br>The DevOverflow Team</p>
  </div>
`;


// --- Controller Methods ---

// @desc      Register user and send verification email
// @route     POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }
    const { name, lastname, email, password } = req.body;

    // API Documentation for /api/auth/register
    if (req.method === 'OPTIONS') {
        return res.status(200).json({
            success: true,
            endpoint: '/api/auth/register',
            method: 'POST',
            description: 'Register a new user account',
            requirements: {
                name: 'String (required)',
                lastname: 'String (required)',
                email: 'Valid email (required)',
                password: 'String, min 6 chars (required)'
            },
            features: [
                '✉️ Automatic verification email',
                '🔐 Secure password hashing',
                '👤 Automatic role assignment',
                '⚡ Instant account creation'
            ],
            returns: 'Success message with verification instructions'
        });
    }

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
        return next(new ErrorResponse('An account with this email is already verified.', 400));
    }
    // If user exists but is not verified, overwrite their record
    if (user && !user.isVerified) {
        await user.deleteOne();
    }

    const role = (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user';
    user = await User.create({ name, lastname, email, password, role, isVerified: false });

    const activationToken = user.getActivationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.RENDER_URL}/api/auth/verify/${activationToken}`;

    try {
        await sendMail({
            to: user.email,
            subject: 'DevOverflow - Please Verify Your Email Address',
            html: getVerificationEmailTemplate(user.name, verificationUrl)
        });
        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            endpoint: '/api/auth/register'
        });
    } catch (err) {
        user.verificationToken = undefined;
        user.verificationExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be sent, please try again.', 500));
    }
});

// @desc      Verify user's email
// @route     GET /api/auth/verify/:token
exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        verificationToken,
        verificationExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid or expired verification token.', 400));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();

    // Send a success response with user details
    res.status(200).json({
        success: true,
        message: `${user.name} ${user.lastname} verified successfully!`,
        endpoint: '/api/auth/verify',
        user: {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            isVerified: true
        }
    });

    // Log the user in immediately after verification
    sendTokenResponse(user, 200, res);
});


// @desc      Login user
// @route     POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }
    const { email, password } = req.body;

    // API Documentation for /api/auth/login
    if (req.method === 'OPTIONS') {
        return res.status(200).json({
            success: true,
            endpoint: '/api/auth/login',
            method: 'POST',
            description: 'Authenticate user and get token',
            requirements: {
                email: 'Valid email (required)',
                password: 'String (required)'
            },
            features: [
                '🔑 JWT Authentication',
                '👤 User profile data',
                '🔒 Secure session management',
                '📱 Mobile-ready response'
            ],
            returns: 'JWT token and user data'
        });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    if (!user.isVerified) {
        return next(new ErrorResponse('Please verify your email address before logging in.', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    sendTokenResponse(user, 200, res);
});


// @desc      Forgot password
// @route     POST /api/auth/forgotPassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // ... logic remains similar, but now using the professional email template ...
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.isVerified) {
        return next(new ErrorResponse('There is no verified user with that email', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.RENDER_URL}/api/auth/reset-password/${resetToken}`;

    try {
        await sendMail({
            to: user.email,
            subject: 'DevOverflow - Password Reset Request',
            html: getPasswordResetEmailTemplate(user.name, resetUrl)
        });
        res.status(200).json({
            success: true,
            message: 'Password reset email sent',
            endpoint: '/api/auth/forgotPassword'
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc      Reset password
// @route     POST /api/auth/resetPassword
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { token, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
        return next(new ErrorResponse('Passwords do not match', 400));
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid or expired token', 400));
    }

    user.password = new_password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send a token so the user is logged in automatically after reset
    sendTokenResponse(user, 200, res);
});


// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
        endpoint: '/api/auth/me'
    });

});
