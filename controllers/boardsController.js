const Board = require('../models/Board');
const Task = require('../models/Task');

async function createBoard(req, res) {
    const {
        name, 
        description
    } = req.body;

    const userId = req.user._id;

    const board = new Board({
        name, 
        description,
        created_by: userId
    });

    try {
        const newLoad = await board.save();
        res.status(200).json({'message': 'Board created successfully'})
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getBoards(req, res) {
    try {
        // const userId = req.user._id;
        const boards = await Board.find();
        // res.status(200).json({'boards': boards})
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getUserBoards(req, res) {
    try {
        const userId = req.user._id;
        const boards = await Board.find({created_by: userId});
        // res.status(200).json({'boards': boards})
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getBoardById(req, res) {
    const id = req.params.id;

    try {
        // const userId = req.user._id;
        const board = await Board.findOne({_id: id});

        if (!board) {
            return res.status(400).json({message: 'No board found'})
        }

        // res.status(200).json({'board': board})
        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function getBoardsByName(req, res) {
    const {name} = req.params;
    try {
        // search for boards which names start from passed string ignoring case
        const boards = await Board.find({name: {"$regex": `^${name}`, '$options' : 'i'}});

        if (!boards) {
            return res.status(400).json({message: 'No boards with such name found'});
        }

        // res.status(200).json({'boards': boards})
        res.status(200).json(boards)
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function updateBoard(req, res) {
    const id = req.params.id;
    // const userId = req.user._id;
    const {name} = req.body;
    try {
        const board = await Board.findOne({_id: id});

        if (!board) {
            return res.status(400).json({message: 'No such board for current user'})
        }

        await board.updateOne({
            $set: {
                name: name
            }
        })

        // await Board.findByIdAndUpdate(id, {name: name});
        res.status(200).json({'message': 'Board updated successfully'});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

async function deleteBoard(req, res) {
    const boardId = req.params.id;
    // const userId = req.user._id;

    try {
        const board = await Board.findOne({_id: boardId});

        if (!board) {
            return res.status(400).json({message: 'No such board'})
        }
        await Board.findOneAndDelete({_id: boardId});
        await Task.deleteMany({board_id: boardId});
        res.status(200).json({'ok': true, 'message': 'Board deleted successfully'});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
}

module.exports = {
    createBoard,
    getBoards,
    deleteBoard,
    getBoardById,
    getBoardsByName,
    updateBoard,
    getUserBoards
}