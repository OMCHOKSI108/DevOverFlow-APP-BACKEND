const express = require('express');
const { 
  createAnswer, updateAnswer, deleteAnswer, voteAnswer, acceptAnswer 
} = require('../controllers/answers');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/:questionId', protect, createAnswer);
router.put('/:id', protect, updateAnswer);
router.delete('/:id', protect, deleteAnswer);
router.post('/:id/vote', protect, voteAnswer);
router.post('/:id/accept', protect, acceptAnswer);

module.exports = router;
