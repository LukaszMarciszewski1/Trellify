import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import path from 'path'
dotenv.config()
const router = express.Router()

const { randomBytes } = await import('crypto')

const conn = mongoose.createConnection(process.env.MONGO_URL)

let gfs
conn.once('open', () => {
  ;(gfs = new mongoose.mongo.GridFSBucket(conn.db)),
    {
      bucketName: 'images',
    }
})

const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      randomBytes(16, (err, buf) => {
        if (err) return reject(err)
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'images',
        }
        resolve(fileInfo)
        // console.log(
        //   `${buf.length} bytes of random data: ${buf.toString('hex')}`
        // )
      })
    })
  },
})

const store = multer({
  storage,
  limits: { fileSize: 20000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) return cb(null, true)
  cb('filetype')
}

const uploadFiles = (req, res, next) => {
  const upload = store.single('image')
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send('File to large')
    } else if (err) {
      if (err === 'filetype') return res.status(400).send('Image files only')
      return res.sendStatus(500)
    }
    next()
  })
}

router.post('/upload/', uploadFiles, async (req, res) => {
  const { file } = req
  const { id } = file
  if (file.size > 5000000) {
    deleteImage(id)
    return res.status(400).send('file may not exceed 5mb')
  }
  console.log('upload file:', file)
  return res.send(file.id)
})

const deleteImage = (id) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id')
  const _id = new mongoose.Types.ObjectId(id)
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error')
  })
}

router.get('/:id', ({ params: { id } }) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id')
  const _id = new mongoose.Types.ObjectId(id)
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send('no files exist')
    gfs.openDownloadStream(_id).pipe(res)
  })
})

export default router
