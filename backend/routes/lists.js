import express from 'express'
const router = express.Router()

import {
  getLists,
  getList,
  createList,
  deleteList,
  updateList,
  getCards,
  addCard,
} from '../controllers/lists.js'
// import { getCards, getCard, createCard, deleteCard, updateCard} from '../controllers/cards.js'

router.get('/', getLists)
router.post('/', createList)
router.get('/:id', getList)
router.patch('/:id', updateList)
router.delete('/:id', deleteList)
router.get('/:id', getCards)
router.put('/:id', addCard)

export default router
