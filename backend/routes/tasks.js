import express from 'express'
const router = express.Router()

import {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
  getCards,
  addCard,
} from '../controllers/tasks.js'
// import { getCards, getCard, createCard, deleteCard, updateCard} from '../controllers/cards.js'

router.get('/', getTasks)
router.post('/', createTask)
router.get('/:id', getTask)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)
router.get('/:id', getCards)
router.put('/:id', addCard)

export default router
