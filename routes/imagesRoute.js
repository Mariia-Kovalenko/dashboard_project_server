const express = require('express');
const storage = require('../helpers/storage');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyToken');

const {
    getImage,
    postImage
} = require('../controllers/imageController');

router.get('/', verifyJWT, getImage);

router.post('/', storage, verifyJWT, postImage);

module.exports = router;