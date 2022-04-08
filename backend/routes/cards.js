import express from 'express'
import { upload } from '../helpers/filehelper.js'
const router = express.Router()

import {
  getCards,
  getCard,
  createCard,
  deleteCard,
  updateCard,
  deleteAllCardsOfList,
  uploadFiles,
  getFiles,
  deleteFile,
} from '../controllers/cards.js'

router.get('/', getCards)
router.post('/', createCard)
router.get('/:id', getCard)
router.patch('/:id', updateCard)
router.delete('/:id', deleteCard)
router.delete('/', deleteAllCardsOfList)
router.post('/:id/files', upload.array('files'), uploadFiles)
router.get('/:id/files', getFiles)
router.delete('/:id/files', deleteFile)

export default router
