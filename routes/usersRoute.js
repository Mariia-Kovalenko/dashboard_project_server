const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyToken');

const {getUser, deleteUser, updateUser, getUserById} = require('../controllers/usersController')

// get current user
router.get('/me', verifyJWT, getUser);

// get user by id
router.get('/:id', verifyJWT, getUserById);

// update current user
router.patch('/me', verifyJWT, updateUser);

// delete current user
router.delete('/me', verifyJWT, deleteUser)


module.exports = router;