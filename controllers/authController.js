const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../config/userValidation');
// const nodemailer = require('nodemailer');

async function registerUser(req, res) {
     // data validation
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).json({'ok': false, 'message': error.details[0].message});
    }
    const {name, email, password} = req.body; 

    // check if user already exists
    const userExists = await User.findOne({email: email});
    if (userExists) {
        return res.status(400).json({'ok': false, 'message': 'User with such email already exists!'})
    }

    // hash password
    const hashedPass = await bcrypt.hash(password, 10);

    let user = new User({
        name: name,
        email: email,
        password: hashedPass
    });

    try {
        const newUser = await user.save();
        res.status(200).json({'ok': true, name: newUser.name, 'message': 'Profile created successfully'})
    } catch (error) {
        res.status(400).json({'ok': false, 'message': error.message});
    }
}



async function loginUser(req, res) {
    // data validation
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).json({'ok': false, 'message': error.details[0].message});
    }
    
    // check if email exists in db
    const foundUser = await User.findOne({email: req.body.email});
    if (!foundUser) {
        return res.status(400).json({'ok': true, 'message':'User doesn`t exist'})
    }

    //  password validation
    const match = await bcrypt.compare(req.body.password, foundUser.password);
    if (!match) {
        return res.status(403).json({'ok': false, 'message':'Access denied'})
    }

    // create and assign token
    const token = jwt.sign({
        _id: foundUser._id
        },
        process.env.ACCESS_TOKEN_SECRET
    )

    // save token to user in db
    try {
        const user = await User.findByIdAndUpdate(foundUser._id, {token: token});
        if (!user) {
            return res.status(400).json({'ok': false, 'message': 'not found'});
        }
        res.status(200).json({'ok': true, 'name': foundUser.name, 'jwt_token': token})
        // res.json({jwt_token: token})
    } catch (error) {
        res.status(500).json({'ok': false, 'message': error.message});
    }
    
    // res.json({jwt_token: token})
}

// logout
async function logoutUser(req, res) {

    // create and assign new token
    const newToken = jwt.sign({
        _id: req.user._id
        },
        process.env.LOGOUT_TOKEN_SECRET
    )

    // change token in db
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {token: newToken});
        if (!updatedUser) {
            return res.status(400).json({'ok': false, 'message': 'not found'});
        }
        res.status(200).json({'ok': false, 'message': 'logged out'});
    } catch (error) {
        res.status(500).json({'ok': false, 'message': error.message});
    }
    
}

// async function forgotPassword(req, res) {
//     const { email } = req.body;

//     const foundUser = await User.findOne({email: email});
//     if (!foundUser) {
//         return res.status(400).json({'message': 'User not registered'})
//     }

//     // create temporary secret to be sent to email
//     const secret = process.env.ACCESS_TOKEN_SECRET + foundUser.password;

//     // create new token
//     const token = jwt.sign({
//         _id: foundUser._id,
//         role: foundUser.role
//     },
//         secret,
//     {expiresIn: '10m'}
//     )
//     const link = `http://localhost:8080/api/auth/reset_password/${foundUser._id}/${token}`;

//     // send link to mail
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'dummyjohn156@gmail.com',
//             pass: 'ekavuvskqfilhsrz'
//         }
//     });

//     let mailOptions = {
//         from: 'Node JS App',
//         to: email,
//         subject: 'Password restoration',
//         text: `To restore your password go to link: ${link}`
//     }

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//             return res.status(500).json({'message': 'Error'})
//         } else {
//             console.log('Email sent: ' + info.response);
//             return res.status(200).json({'message': 'New password sent to your email address'})
//         }
//     })
// }

// async function resetPassword(req, res) {
//     const {id, token} = req.params;

//     // check if user with id exists
//     const foundUser = await User.findOne({_id: id});
//     if (!foundUser) {
//         return res.status(400).json({'message':'User doesn`t exist'})
//     }

//     // generate secret and verify token
//     const secret = process.env.ACCESS_TOKEN_SECRET + foundUser.password;
    
//     try {
//         const verified = jwt.verify(token, secret);
//         res.render('reset_password', {email: foundUser.email})
//         // res.status(200).json({user: verified});
//     } catch (error) {
//         res.status(400).send('Invalid token');
//     }
// }

async function setNewPassword(req, res) {
    const {id, token} = req.params;
    const {password} = req.body;

    const foundUser = await User.findOne({_id: id});
    if (!foundUser) {
        return res.status(400).json({'message':'User doesn`t exist'})
    }

    // generate secret and verify token
    const secret = process.env.ACCESS_TOKEN_SECRET + foundUser.password;
    
    try {
        const verified = jwt.verify(token, secret);
        const hashedPass = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(id, {password: hashedPass});
        if (!updatedUser) {
            return res.status(500).json({'message': 'not found'});
        }
        res.status(200).send('Password changed successfully');
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}

module.exports = {
    registerUser,
    loginUser,
    setNewPassword,
    logoutUser
}