const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    description: {
        type: String,
        max: 25
    },
    state: {
        type: String,
        required: true,
        enum: ['toDo', 'inProgress', 'done'],
        default: 'toDo'
    },
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: Array,
        message: { type: String, max: 50 },
        time: { 
            type: String,
            default: Date.now
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        user_name: {
            type: String
        }
    }
});

module.exports = mongoose.model('Task', taskSchema);