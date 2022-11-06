const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function getUser(req, res) {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(400).json({'message': 'User not found'});
        }
        const {_id, name, email, created_date} = user;
        // res.status(200).json({'user': {_id, name, email, created_date}});
        res.status(200).json({_id, name, email, created_date});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getUserById(req, res) {
    const id = req.params.id
    try {
        const user = await User.findOne({ _id: id});
        if (!user) {
            return res.status(400).json({'message': 'User not found'});
        }
        const {_id, name} = user;
        res.status(200).json({'user': {_id, name}});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function deleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete({ _id: req.user._id });
        if (!deletedUser) {
            return res.status(400).json({'message': 'User not found'});
        }
        res.status(200).json({'message': 'Profile deleted successfully'});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function updateUser(req, res) {
    const {name, email, password} = req.body;

    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(400).json({'message': 'User not found'});
        }
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(403).json({'message': 'User with such email already exists'});
        }
        if (!name && !email && !password) {
            return res.status(400).json({'message': 'Nothing to update'});
        }
        let credentials = {};
        if (name) {
            credentials = {...credentials, name}
        }
        if (email) {
            credentials = {...credentials, email}
        }
        if (password) {
            const hashedPass = await bcrypt.hash(password, 10);
            credentials = {...credentials, password: hashedPass}
        }
        const updatedUser = await User.findOneAndUpdate(user._id, credentials, {returnOriginal: false});

        if (updatedUser) {
            res.status(200).json({'message': 'Profile updated successfully', user: {name: updatedUser.name, email: updatedUser.email}});
        }
        
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}



module.exports = {
    getUser,
    getUserById,
    deleteUser,
    updateUser
}