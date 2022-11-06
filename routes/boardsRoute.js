const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyToken');

const {
    createBoard,
    getBoards,
    deleteBoard,
    getBoardById,
    getBoardsByName,
    updateBoard,
    getUserBoards
} = require ('../controllers/boardsController');

router.post('/', verifyJWT, createBoard);

router.get('/', verifyJWT, getBoards);

router.get('/my_boards', verifyJWT, getUserBoards);

router.get('/:name/find_boards', verifyJWT, getBoardsByName);

router.get('/:id', verifyJWT, getBoardById);

router.put('/:id', verifyJWT, updateBoard);

router.delete('/:id', verifyJWT, deleteBoard);

module.exports = router;