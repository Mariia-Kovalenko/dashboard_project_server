const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // image: {
    //     data: Buffer, 
    //     contentType: String 
    // }
    imagePath: { 
        type: String, 
        required: true 
    },
});

module.exports = mongoose.model('Image', imageSchema);