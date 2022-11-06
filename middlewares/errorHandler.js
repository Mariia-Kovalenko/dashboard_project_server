function errorHandler (err, req, res, next) {
    console.error(`error: ${err.name}, ${err.message}`)
    res.status(500).send({'message': err.message});
}

module.exports = errorHandler;