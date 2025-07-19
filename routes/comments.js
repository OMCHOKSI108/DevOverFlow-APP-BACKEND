const express = require('express');
const {
  addCommentToQuestion, addCommentToAnswer, getQuestionComments, getAnswerComments,
  voteOnComment, updateComment, deleteComment
} = require('../controllers/comments');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/question/:questionId', getQuestionComments);
router.get('/answer/:answerId', getAnswerComments);

router.post('/question/:questionId', protect, addCommentToQuestion);
router.post('/answer/:answerId', protect, addCommentToAnswer);

router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/vote', protect, voteOnComment);

module.exports = router;
