import express from 'express'
const router = express.Router()

import {
  getLists,
  getList,
  createList,
  deleteList,
  updateList,
  // getCards,
  addCard,
  getUpdateList,
  getUpdateCards
} from '../controllers/lists.js'
// import { getCards, getCard, createCard, deleteCard, updateCard} from '../controllers/cards.js'

router.get('/', getLists)
router.post('/', createList)
// router.get('/:id', getList)
router.patch('/:id', updateList)
router.delete('/:id', deleteList)
// router.get('/:id', getCards)
// router.patch('/:id', getUpdateList)
router.put('/:id', getUpdateList)

export default router
