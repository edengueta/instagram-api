const mongoose = require ('mongoose');

const Comment = mongoose.model('Comment', {
    user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User',
    },
    postId: {
        type:mongoose.ObjectId,
        required:true
    },
    content: {
        type: String,
        required:true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: ()=> new Date(),
    },
});

module.exports = Comment;