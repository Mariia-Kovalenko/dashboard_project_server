const Image = require('../models/Image');
const fs = require('fs');

async function getImage(req, res) {
    const userId = req.user._id;
    try {
        const userProfileImage = await Image.findOne({user_id: userId});
        res.json({'userImage': userProfileImage});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function postImage(req, res) {
    const userId = req.user._id;
    console.log(req.file);
    const imagePath = 'http:/localhost:8080/api/images/' + req.file.filename;
    try {
        // const newItem = new Image({
        //     userId,
        //     image: {
        //         data: fs.readFileSync(req.file.path),
        //         contentType: 'image/jpeg'
        //     }
        // });
        // const createdImage = await newItem.save();

        const image = new Image({
            userId,
            imagePath
        })
        const createdImage = await image.save();
        res.status(201).json({message: 'Image added successfully'});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

module.exports = {
    postImage,
    getImage
}