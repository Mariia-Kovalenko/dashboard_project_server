const Task = require('../models/Task');
const Board = require('../models/Board');
const User = require('../models/User');
const mongoose = require('mongoose')

async function addTaskToBoard(req, res) {
    const {
        name,
        description,
        state
    } = req.body;

    const boardId = req.params.id;
    // console.log(boardId);
    const userId = req.user._id;
    try {
        const boardFound = Board.findOne({_id: boardId});

        if (!boardFound) {
            return res.json({message: 'Board not found'});
        }

        const newTask = new Task({
            name,
            description,
            board_id: boardId,
            state: state
        });

        const taskSaved = await newTask.save();
        res.status(200).json({message: 'Task created successfully'})
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getTasks(req, res) {
    const boardId = req.params.id;
    try {
        const boardFound = await Board.findOne({_id: boardId});

        if (!boardFound) {
            return res.json({message: 'Board not found'});
        }

        const tasks = await Task.find({board_id: boardFound._id});
        if (!tasks) {
            return res.status(400).json({message: 'No boards with such name found'});
        }

        res.status(200).json(tasks);
        // res.status(200).json({'tasks': tasks});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getTasksByName(req, res) {
    const {name, board_id} = req.params;
    try {
        // search for boards which names start from passed string ignoring case
        const tasks = await Task.find({name: {"$regex": `^${name}`, '$options' : 'i'}, board_id: board_id});

        if (!tasks) {
            return res.status(400).json({message: 'No tasks with such name found'});
        }

        res.status(200).json(tasks);
        // res.status(200).json({'tasks': tasks});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getTaskById(req, res) {
    const {task_id} = req.params;

    try {
        const task = await Task.findOne({_id: task_id});

        if (!task) {
            return res.json({message: 'Task not found'});
        }

        if (!task) {
            return res.json({message: 'Task not found'});
        }

        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function updateTask(req, res) {
    const {board_id, task_id} = req.params;
    const {name, description, state} = req.body;

    try {
        const boardFound = await Board.findOne({_id: board_id});
        if (!boardFound) {
            return res.json({message: 'Board not found'});
        }

        let data = {};

        if (name) {
            data = {
                name
            }
        } 
        if (state) {
            data = {
                ...data,
                state
            }
        } 
        if (description) {
            data = {
                ...data,
                description
            }
        }

        let task = await Task.findByIdAndUpdate(task_id, data);
        
        if (!task) {
            return res.json({message: 'Task not found'});
        }
        res.status(200).json({'ok': true, 'message': 'Task Updated successfully'})

    } catch (error) {
        res.status(500).json({'ok': false, 'message': error.message});
    }
}

async function archiveTask(req, res) {
    const {board_id, task_id} = req.params;

    try {
        const boardFound = await Board.findOne({_id: board_id});

        if (!boardFound) {
            return res.json({message: 'Board not found'});
        }

        const task = await Task.findByIdAndUpdate(task_id, {state: "archived", board_id: null});

        if (!task) {
            return res.json({message: 'Task not found'});
        }

        res.status(200).json({'message': 'Task Archived successfully'})
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getArchivedTasks(req, res) {
    try {
        const tasks = await Task.find({state: 'archived'});

        if (!tasks) {
            return res.json({message: 'No archived tasks found'});
        }
        res.status(200).json(tasks)
        // res.status(200).json({tasks: tasks})
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function commentTask(req, res) {
    const {message} = req.body;
    const {task_id} = req.params;

    try {
        const task = await Task.findOne({_id: task_id});
        if (!task) {
            return res.status(400).json({message: 'Task not found'});
        }
        const date = new Date(Date.now());
        const user = await User.findOne({_id: req.user._id});

        const updatedTask = await task.updateOne(
            {
                $push: {
                    comments: {
                        '_id': new mongoose.Types.ObjectId(),
                        'message': message,
                        'time': date,
                        'user_id': req.user._id,
                        'user_name': user.name
                    }
                }
        })
        res.status(200).json({'message': 'Task commented'})
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function deleteComment(req, res) {
    const {task_id} = req.params;
    const {commentId} = req.body;

    try {

        const task = await Task.findOne({_id: task_id});
        if (!task) {
            return res.json({message: 'Task not found'});
        }

        console.log(task);

        const updatedTask = await task.updateOne(
            {
                $pull: {
                    comments: {
                        _id:  new mongoose.Types.ObjectId(commentId)
                    }
                }
            }
        )

        res.status(200).json({'message': 'comment deleted successfully'})
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function deleteTask(req, res) {
    const {board_id, task_id} = req.params;

    try {
        const boardFound = await Board.findOne({_id: board_id});

        if (!boardFound) {
            return res.json({message: 'Board not found'});
        }

        const task = await Task.findByIdAndDelete(task_id);

        res.status(200).json({'message': 'Task deleted successfully'})
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

module.exports = {
    addTaskToBoard,
    getTasks,
    getTasksByName,
    getTaskById,
    deleteTask,
    updateTask,
    archiveTask,
    getArchivedTasks,
    commentTask,
    deleteComment
}