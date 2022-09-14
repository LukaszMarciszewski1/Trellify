import mongoose from 'mongoose'
import { config } from './config'

export const connectDB = async () => {
  await mongoose
    .connect(config.mongo.url)
    .then(() => {
      console.log('connected to mongoDB')
    })
    .catch((error) => {
      console.log(`${error} did not connect`)
      process.exit(1)
    })
}

