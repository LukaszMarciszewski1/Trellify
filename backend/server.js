import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import cors from 'cors'
import multer from 'multer'

import { connectDB, getDB } from './config/mongoose.js'

import boardRoutes from './routes/boards.js'
import listRoutes from './routes/lists.js'
import cardRouters from './routes/cards.js'
import filesRoutes from './routes//files.js'

dotenv.config()
const app = express()

//connection to database mongoDB
connectDB()

//middlewares
app.use(cors())
app.use(helmet())
app.use(express.json())

//routes
app.use(express.static('upload'))
app.use('/boards', boardRoutes)
app.use('/lists', listRoutes)
app.use('/cards', cardRouters)
app.use('/files', filesRoutes)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage }).single('file')

app.post('/files', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err)
    }

    return res.status(200).send(req.files)
  })
})

app.get('/', (req, res) => {
  res.end('Hello world!')
  const dbInstance = getDB()
  console.log(dbInstance)
})
app.listen(process.env.PORT, () => {
  console.log('server is running')
})

