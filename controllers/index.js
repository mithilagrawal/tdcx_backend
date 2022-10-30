/**
 * Load the required package into the module
 */

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { login, dashboard, createTasks, getTasks } = require('./users');

const router = express.Router();

router.post('/login', login);
router.get('/dashboard', authMiddleware, dashboard);
router.post('/tasks', authMiddleware, createTasks);
router.get('/tasks', authMiddleware, getTasks);

module.exports = router;