const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] },
  lastname: { type: String, required: [true, 'Please add a last name'] },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Please add a password'], 
    minlength: 6, 
    select: false 
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpire: Date,

  geminiApiKey: { type: String, select: false },

  profilePicture: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_face,r_max/face_left.png' },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash a token (for verification or password reset)
UserSchema.methods.getActivationToken = function () {
    const activationToken = crypto.randomBytes(20).toString('hex');
    this.verificationToken = crypto.createHash('sha256').update(activationToken).digest('hex');
    this.verificationExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    return activationToken;
};

// Generate and hash password token for password reset
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);