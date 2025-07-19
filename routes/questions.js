const express = require('express');
const { 
  getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion, 
  searchQuestions, getTrendingTags, voteQuestion 
} = require('../controllers/questions');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.get('/', getQuestions);
router.get('/search', searchQuestions);
router.get('/tags/trending', getTrendingTags);
router.get('/:id', getQuestion);

// Protected routes
router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.post('/:id/vote', protect, voteQuestion);

module.exports = router;
