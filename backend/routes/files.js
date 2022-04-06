import express from 'express'
const router = express.Router()

import {
  getFiles,
  getFile,
  addFile,
  deleteFile,
} from '../controllers/files.js'

router.get('/', getFiles)
router.get('/:id', getFile)
router.post('/', addFile)
router.delete('/:id', deleteFile)


export default router