import 'dotenv/config'
import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config/mongoose'

import boardRoutes from './routes/boards'
import listRoutes from './routes/lists'
import cardRouters from './routes/cards'
import filesRouters from './routes/files'
import usersRouters from './routes/users'
import productsRouters from './routes/products'
// import { errorHandler, notFound } from './middlewares/errorHandler'
import { errorHandler, notFound } from './middlewares/errorHandler';

const app: Application  = express()
// const __dirname = path.resolve()

//connection to database mongoDB
connectDB()

//middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())

//routes
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/boards', boardRoutes)
app.use('/lists', listRoutes)
app.use('/cards', cardRouters)
app.use('/files', filesRouters)
app.use('/users', usersRouters)
app.use('/products', productsRouters)
app.use(errorHandler)
app.use(notFound)

app.get('/', (req, res) => {
  res.end('Hello world!')
})

const port = 5000

app.listen(port, () => {
  console.log('server is running')
})
