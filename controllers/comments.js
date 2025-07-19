const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

exports.addCommentToQuestion = asyncHandler(async (req, res, next) => res.status(201).json({ success: true, data: `Comment added to question ${req.params.questionId}` }));
exports.addCommentToAnswer = asyncHandler(async (req, res, next) => res.status(201).json({ success: true, data: `Comment added to answer ${req.params.answerId}` }));
exports.getQuestionComments = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Comments for question ${req.params.questionId}` }));
exports.getAnswerComments = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Comments for answer ${req.params.answerId}` }));
exports.voteOnComment = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Voted on comment ${req.params.id}` }));
exports.updateComment = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Updated comment ${req.params.id}` }));
exports.deleteComment = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, data: `Deleted comment ${req.params.id}` }));
