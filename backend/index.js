import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'

import taskRoutes from './routes/tasks.js'
import cardRouters from './routes/cards.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(helmet())

//routes
app.use('/tasks', taskRoutes)
app.use('/cards', cardRouters)

const start = async () => {
   await mongoose
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
}


// app.get('/', (req, res) => {
//   res.send('server is working')
// })

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'))
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//   })
// }

app.listen(process.env.PORT, () => {
  console.log('server słucha')
})
start()