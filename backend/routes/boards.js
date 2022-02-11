import express from 'express'
const router = express.Router()

import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,

} from '../controllers/boards.js'
// import { getCards, getCard, createCard, deleteCard, updateCard} from '../controllers/cards.js'

router.get('/', getBoards)
router.get('/:id', getBoard)
router.post('/', createBoard)
router.patch('/:id', updateBoard)

export default router