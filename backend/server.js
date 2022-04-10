import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import { connectDB, getDB } from './config/mongoose.js'

import boardRoutes from './routes/boards.js'
import listRoutes from './routes/lists.js'
import cardRouters from './routes/cards.js'
import filesRouters from './routes/files.js'

dotenv.config()
const app = express()
const __dirname = path.resolve()

//connection to database mongoDB
connectDB()

//middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())

//routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/boards', boardRoutes)
app.use('/lists', listRoutes)
app.use('/cards', cardRouters)
app.use('/files', filesRouters)

app.get('/', (req, res) => {
  res.end('Hello world!')
  const dbInstance = getDB()
})

app.listen(process.env.PORT, () => {
  console.log('server is running')
})
