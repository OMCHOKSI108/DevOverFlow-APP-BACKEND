const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const ErrorResponse = require('../utils/errorResponse');

exports.adminGetAllUsers = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, message: 'All users for admin' }));
exports.adminDeleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }
    // await user.remove(); // or other deletion logic
    res.status(200).json({ success: true, message: `User ${req.params.id} deleted` });
});
exports.adminGetAllQuestions = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, message: 'All questions for admin' }));
exports.adminDeleteQuestion = asyncHandler(async (req, res, next) => res.status(200).json({ success: true, message: `Question ${req.params.id} deleted by admin` }));
exports.adminGetStats = asyncHandler(async (req, res, next) => {
    const userCount = await User.countDocuments();
    const questionCount = await Question.countDocuments();
    const answerCount = await Answer.countDocuments();
    res.status(200).json({ success: true, stats: { userCount, questionCount, answerCount } });
});
