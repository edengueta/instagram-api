const mongoose = require ('mongoose');

const Post = mongoose.model('Post', {
    userId: {
        type: mongoose.ObjectId,
        // required: true,
        ref: 'User',
    },
    caption:String,
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: ()=> new Date(),
        required: true,
    },
});

module.exports = Post;