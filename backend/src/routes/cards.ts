import express from 'express'
const router = express.Router()

import {
  getCards,
  getCard,
  createCard,
  deleteCard,
  updateCard,
} from '../controllers/cards'

router.get('/', getCards)
router.post('/', createCard)
router.get('/:id', getCard)
router.patch('/:id', updateCard)
router.delete('/:id', deleteCard)

export default router
