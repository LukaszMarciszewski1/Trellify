import 'dotenv/config'

const MONGO_URL = process.env.MONGO_URL || ''
const SERVER_PORT = Number(process.env.PORT) || 1337
const JWT_SECRET = process.env.JWT_SECRET || ''
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || ''
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION || ''
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || ''
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || ''

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    s3: {
       bucket_name: S3_BUCKET_NAME,
       bucket_region: S3_BUCKET_REGION,
       secret_access_key: S3_SECRET_ACCESS_KEY,
       access_key: S3_ACCESS_KEY
    },
    jwt :{
      secret: JWT_SECRET 
    }
}