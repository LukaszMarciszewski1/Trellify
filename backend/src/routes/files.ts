import express from 'express'
import { upload } from '../helpers/filehelper.js'
const router = express.Router()

import { uploadFiles, getFiles, deleteFile, downloadFile } from '../controllers/files'

router.post('/', upload.array('files'), uploadFiles)
router.get('/', getFiles)
router.get('/:id', downloadFile)
router.delete('/:id', deleteFile)

export default router
