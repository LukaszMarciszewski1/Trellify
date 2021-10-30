import express from 'express'
const router = express.Router()

import { getTasks, createTask, deleteTask } from '../controllers/tasks.js';

router.get('/', getTasks)
router.post('/', createTask)
router.delete('/:id', deleteTask);

export default router
