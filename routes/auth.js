const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  verifyEmail,
  login, 
  forgotPassword, 
  resetPassword, 
  getMe 
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', [
    body('name', 'Name is required').not().isEmpty(),
    body('lastname', 'Last name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], register);

router.get('/verify/:token', verifyEmail);

router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], login);

router.post('/forgotPassword', [body('email').isEmail()], forgotPassword);
router.post('/resetPassword', [body('token').not().isEmpty(), body('new_password').isLength({ min: 6 })], resetPassword);

router.get('/me', protect, getMe);

module.exports = router;