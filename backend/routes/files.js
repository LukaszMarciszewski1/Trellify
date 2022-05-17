import express from 'express'
import { upload } from '../helpers/filehelper.js'
const router = express.Router()

import { uploadFiles, getFiles, deleteFile } from '../controllers/files.js'

router.post('/', upload.array('files'), uploadFiles)
router.get('/', getFiles)
router.delete('/:id', deleteFile)

export default router
