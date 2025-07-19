const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, users: users });
});

// @desc      Get single user
// @route     GET /api/users/:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    // A user can get their own profile, or an admin can get any
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
         return next(new ErrorResponse('Not authorized to view this profile', 403));
    }

    res.status(200).json({ success: true, user: user });
});
