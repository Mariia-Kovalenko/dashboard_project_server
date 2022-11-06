const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    description: {
        type: String,
        required: true,
        min: 3
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Board', boardSchema);