import express from 'express'
const router = express.Router()

import { getTasks, getTask, createTask, deleteTask, updateTask  } from '../controllers/tasks.js'

router.get('/', getTasks)
router.post('/', createTask)
router.get('/:id', getTask)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)


export default router
