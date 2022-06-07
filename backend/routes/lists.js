import express from 'express'
const router = express.Router()

import {
  getLists,
  getList,
  createList,
  deleteList,
  updateList,
  deleteAllCardsOfList
} from '../controllers/lists.js'

router.get('/', getLists)
router.get('/:id', getList)
router.post('/', createList)
router.patch('/:id', updateList)
router.patch('/:id/cards', deleteAllCardsOfList)
router.delete('/:id', deleteList)


export default router
