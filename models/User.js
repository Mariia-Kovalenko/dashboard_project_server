const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 3
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);