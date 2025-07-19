const asyncHandler = require('../middleware/async');
const Answer = require('../models/Answer');
const ErrorResponse = require('../utils/errorResponse');

exports.createAnswer = asyncHandler(async (req, res, next) => res.status(201).json({ success: true, message: `Answer created for question ${req.params.questionId}` }));
exports.updateAnswer = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, message: `Answer ${req.params.id} updated` }));
exports.deleteAnswer = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, message: `Answer ${req.params.id} deleted` }));
exports.voteAnswer = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, message: `Voted on answer ${req.params.id}` }));
exports.acceptAnswer = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, message: `Answer ${req.params.id} accepted` }));
