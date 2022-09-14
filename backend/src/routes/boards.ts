import express from 'express'
import { protect } from '../middlewares/authMiddleware'
const router = express.Router()

import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
} from '../controllers/boards'

router.get('/', protect, getBoards)
router.get('/:id', protect, getBoard)
router.post('/', protect, createBoard)
router.patch('/:id', protect, updateBoard)

export default router
