const mongoose = require ('mongoose');

const User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    bio: String,
    avatar: String,
    createdAt: {
        type: Date,
        default: ()=> new Date(),
        required: true,
    },
    followers:[mongoose.ObjectId]
});
module.exports = User;