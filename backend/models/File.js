import mongoose from 'mongoose'
const { Schema } = mongoose

const FileSchema = new Schema(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
    },
    fileName: {
      type: String,
      // required: true,
    },
    filePath: {
      type: String,
      // required: true,
    },
    fileType: {
      type: String,
      // required: true,
    },
    fileSize: {
      type: String,
      // required: true,
    },
    fileUrl: String,
    fileKey: String
  },
  { timestamps: true }
)

const File = mongoose.model('File', FileSchema)

export default File
