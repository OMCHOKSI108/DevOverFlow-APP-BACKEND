const express = require('express');
const { getUsers, getUser } = require('../controllers/users');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// User routes are for getting profiles
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUser);

module.exports = router;
