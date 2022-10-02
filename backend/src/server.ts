import 'dotenv/config'
import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { connectDB } from './db/mongoose'
import { config } from './config/config'

import boardRoutes from './routes/boards'
import listRoutes from './routes/lists'
import cardRouters from './routes/cards'
import filesRouters from './routes/files'
import usersRouters from './routes/users'
import productsRouters from './routes/products'
import { errorHandler, notFound } from './middlewares/errorHandler'

const app: Application = express()

//connection to database mongoDB
connectDB()

//middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())

//routes
app.use('/users', usersRouters)
app.use('/boards', boardRoutes)
app.use('/lists', listRoutes)
app.use('/cards', cardRouters)
app.use('/files', filesRouters)
app.use('/products', productsRouters)
app.use(errorHandler)
app.use(notFound)

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '1800')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, PATCH, OPTIONS'
  )
  // res.end('Hello world!')
})

app.listen(config.server.port, () => {
  console.log('server is running')
})
