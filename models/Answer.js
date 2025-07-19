const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Please add answer text']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('Answer', AnswerSchema);
