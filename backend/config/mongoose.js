import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () => {
  const database = await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log('connected to mongoDB')
      // console.log(`mongoDB connected: ${res.connection.host}`)
    })
    .catch((error) => {
      console.log(`${error} did not connect`)
      process.exit(1)
    })
}

