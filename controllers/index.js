/**
 * Load the required package into the module
 */

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { login, dashboard, createTasks, getTasks, editTask, deleteTask } = require('./users');

const router = express.Router();

router.post('/login', login);
router.get('/dashboard', authMiddleware, dashboard);
router.post('/tasks', authMiddleware, createTasks);
router.get('/tasks', authMiddleware, getTasks);
router.put('/tasks/:id', authMiddleware, editTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);

module.exports = router;