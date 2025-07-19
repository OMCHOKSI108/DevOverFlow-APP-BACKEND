const express = require('express');
const {
  getAiStatus, 
  getAnswerSuggestion, 
  createAiAnswer, 
  getTagSuggestions, 
  getQuestionImprovements,
  chatbot
} = require('../controllers/ai');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Public status check
router.get('/status', getAiStatus);

// All other routes require a logged in user
router.use(protect);

router.post('/chatbot', chatbot);
router.get('/answer-suggestion/:id', getAnswerSuggestion);
router.post('/answer-suggestion/:id', createAiAnswer);
router.post('/tag-suggestions', getTagSuggestions);
router.post('/question-improvements', getQuestionImprovements);

module.exports = router;