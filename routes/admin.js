const express = require('express');
const {
  adminGetAllUsers, adminDeleteUser, adminGetAllQuestions,
  adminDeleteQuestion, adminGetStats
} = require('../controllers/admin');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// ALL admin routes are protected and require 'admin' role
router.use(protect, adminOnly);

router.get('/users', adminGetAllUsers);
router.delete('/users/:id', adminDeleteUser);
router.get('/questions', adminGetAllQuestions);
router.delete('/questions/:id', adminDeleteQuestion);
router.get('/stats', adminGetStats);

module.exports = router;
