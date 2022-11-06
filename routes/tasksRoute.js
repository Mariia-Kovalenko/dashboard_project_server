const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyToken');

const {
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
} = require('../controllers/tasksController');

router.get('/archive', verifyJWT, getArchivedTasks);

router.patch('/:task_id/comment', verifyJWT, commentTask);

router.get('/:board_id/:name/find_tasks', verifyJWT, getTasksByName);

router.patch('/:task_id/delete_comment', verifyJWT, deleteComment);

router.post('/:id', verifyJWT, addTaskToBoard);

router.get('/:id', verifyJWT, getTasks);

router.get('/:task_id/task', verifyJWT, getTaskById);

router.delete('/:board_id/:task_id', verifyJWT, deleteTask);

router.patch('/:board_id/:task_id', verifyJWT, updateTask);

router.post('/:board_id/:task_id', verifyJWT, archiveTask);


module.exports = router;

