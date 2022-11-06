require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/dbConnection');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 8080;


const authRoute = require('./routes/authRoute');
const usersRoute = require('./routes/usersRoute');
const boardsRoute = require('./routes/boardsRoute');
const tasksRoute = require('./routes/tasksRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(':method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
app.set('view engine', 'ejs');

connectDB();

mongoose.connection.once('open', () => {
    console.log('Connected to db');
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    })
});

// routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/boards', boardsRoute);
app.use('/api/tasks', tasksRoute);

//ERROR HANDLER
app.use(errorHandler);