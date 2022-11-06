// validation
const Joi = require('@hapi/joi');

// register validation
const registerValidation = (data) => {
    // check if user credentials match the requirements
    const schema = Joi.object().keys({
        name: Joi.string().min(3),
        email: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(3).required()
    })
    return schema.validate(data)
}

// login validation
const loginValidation = (data) => {
    // check if user credentials match the requirements
    const schema = Joi.object().keys({
        email: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(3).required()
    })
    return schema.validate(data)
}

module.exports = { registerValidation, loginValidation };