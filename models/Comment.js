const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Comment body is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    question: { // Comment is on a question
        type: mongoose.Schema.ObjectId,
        ref: 'Question'
    },
    answer: { // OR an answer
        type: mongoose.Schema.ObjectId,
        ref: 'Answer'
    },
    upvotes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a comment is linked to either a question OR an answer, not both.
CommentSchema.pre('save', function (next) {
    if (this.question && this.answer) {
        next(new Error('A comment cannot be linked to both a question and an answer.'));
    }
    if (!this.question && !this.answer) {
        next(new Error('A comment must be linked to either a question or an answer.'));
    }
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);
