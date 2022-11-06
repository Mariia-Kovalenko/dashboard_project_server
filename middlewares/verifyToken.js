const jwt = require('jsonwebtoken');
// might be useless
const jwt_decode = require('jwt-decode');
const User = require('../models/User');

// middleware for jwt verification
async function verifyJWT(req, res, next) {

    if (!req.headers['authorization']) {
        return res.status(401).send('No request headers');
    }
    const token = req.headers['authorization'].split(' ')[1];
    // const token = req.headers['authorization'];
    const payload = jwt_decode(token);
    // console.log(payload);

    if (!token) {
        return res.status(403).send('Access denied!');
    }

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const foundUser = await User.findById({ _id: verified._id });
        if (!foundUser) {
            return res.status(400).json({'message': 'User not found'});
        } else {
            req.user = verified;
            next()
            // check if token corresponds
            // if (foundUser.token === token) {
            //     req.user = verified;
            //     next()
            // } else {
            //     return res.status(400).json({'message': 'User logged out'});
            // }
        }
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}

module.exports = verifyJWT;