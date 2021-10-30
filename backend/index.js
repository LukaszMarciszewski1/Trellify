import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'

import taskRoutes from './routes/tasks.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(cors())

//routes
app.use('/tasks', taskRoutes)

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('conected to mongoDB')
  })
  .catch((error) => {
    console.log(`${error} did not connect`)
  })

app.get('/', (req, res) => {
  res.send('server is working')
})

app.listen(process.env.PORT, () => {
  console.log('server słucha')
})
