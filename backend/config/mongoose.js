import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

let dbInstance = null

export const connectDB = async () => {
  const database = await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log('connected to mongoDB')
      dbInstance = res.connection
      const el = getDB()
    })
    .catch((error) => {
      console.log(`${error} did not connect`)
      process.exit(1)
    })
}
// const conn = mongoose.createConnection(process.env.MONGO_URL)

// let gfs
// conn.once('open', () => {
//   gfs = new mongoose.mongo.GridFSBucket(conn.db), {
//       bucketName: 'files',
//     }
// })

export const getDB = () => {
  if (!dbInstance) throw new Error('Must connect to Database first!')
  return dbInstance
}
