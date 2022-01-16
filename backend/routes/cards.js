import express from 'express'
const router = express.Router()

import {
  getCards,
  getCard,
  createCard,
  deleteCard,
  updateCard,
  deleteAllCardsOfList,
  updateAllCards,
} from '../controllers/cards.js'

router.get('/', getCards)
router.post('/', createCard)
router.get('/:id', getCard)
router.patch('/:id', updateCard)
router.put('/', updateAllCards)
router.delete('/:id', deleteCard)
router.delete('/', deleteAllCardsOfList)

export default router
