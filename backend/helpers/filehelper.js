import dotenv from 'dotenv'
import multer from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'
dotenv.config()
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
})

const storage = multerS3({
  s3,
  bucket: process.env.S3_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    !file.originalname.match(/\.(jpeg|jpg|png|webp|pdf|doc|docx|xlsx|xls)$/)
  ) {
    return cb(
      new Error(
        'only upload files with jpg, jpeg, png, webp, pdf, doc, docx, xslx, xls format.'
      )
    )
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 10 },
})









// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
//   },
// })

// const fileFilter = (req, file, cb) => {
//   if (
//     !file.originalname.match(/\.(jpeg|jpg|png|webp|pdf|doc|docx|xlsx|xls)$/)
//   ) {
//     return cb(
//       new Error(
//         'only upload files with jpg, jpeg, png, webp, pdf, doc, docx, xslx, xls format.'
//       )
//     )
//   }
//   cb(null, true)
// }

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 1000000000, files: 10 },
// })
