import express from 'express'
import { upload } from '../helpers/filehelper.js'
const router = express.Router()

import {
  getCards,
  getCard,
  createCard,
  deleteCard,
  updateCard,
  uploadFiles,
  getFiles,
} from '../controllers/cards.js'

router.get('/', getCards)
router.post('/', createCard)
router.get('/:id', getCard)
router.patch('/:id', updateCard)
router.delete('/:id', deleteCard)
router.post('/:id/files', upload.array('files'), uploadFiles)
router.get('/:id/files', getFiles)

export default router
