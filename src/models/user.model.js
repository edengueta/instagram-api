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
    avatar: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: ()=> new Date(),
        required: true,
    },
    followers:[mongoose.ObjectId]
});
module.exports = User;