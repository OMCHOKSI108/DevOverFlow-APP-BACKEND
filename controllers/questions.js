const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Question = require('../models/Question');

// A helper function for voting logic
const vote = async (model, id, userId, voteType) => {
  const doc = await model.findById(id);
  if (!doc) {
    throw new ErrorResponse('Resource not found', 404);
  }

  const oppositeVote = voteType === 'upvotes' ? 'downvotes' : 'upvotes';
  
  // Remove user from opposite vote array if present
  doc[oppositeVote].pull(userId);

  // Add or remove user from the voteType array
  if (doc[voteType].includes(userId)) {
    doc[voteType].pull(userId); // User is retracting vote
  } else {
    doc[voteType].push(userId); // User is casting vote
  }
  
  await doc.save();
  return doc;
}

exports.getQuestions = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: 'All questions' }));
exports.getQuestion = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Question ${req.params.id}` }));
exports.createQuestion = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question });
});
exports.updateQuestion = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Updated Question ${req.params.id}` }));
exports.deleteQuestion = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Deleted Question ${req.params.id}` }));
exports.voteQuestion = asyncHandler(async (req, res, next) => {
  const { vote: voteType } = req.body; // 'up' or 'down'
  const doc = await vote(Question, req.params.id, req.user.id, voteType === 'up' ? 'upvotes' : 'downvotes');
  res.status(200).json({ success: true, data: doc });
});
exports.searchQuestions = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Search results for: ${req.query.q}` }));
exports.getTrendingTags = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, tags: ['nodejs', 'express', 'mongodb'] }));
