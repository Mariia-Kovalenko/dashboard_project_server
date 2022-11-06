const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyToken');

const {registerUser, loginUser, setNewPassword, logoutUser} = require('../controllers/authController');

router.post('/register', registerUser);

router.post('/login', loginUser)

router.post('/logout', verifyJWT, logoutUser)

// router.post('/forgot_password', forgotPassword)

// router.get('/reset_password/:id/:token', resetPassword)

// router.post('/reset_password/:id/:token', setNewPassword)

module.exports = router;