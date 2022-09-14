import mongoose, { Schema, Types } from 'mongoose'

interface IFile {
  cardId: Types.ObjectId
  fileName: string
  // filePath?: string
  fileType: string
  fileSize: string
  fileUrl: string
  fileKey: string
}

const FileSchema = new Schema(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
    },
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: String,
    fileUrl: String,
    fileKey: String,
  },
  { timestamps: true }
)

export const File = mongoose.model('File', FileSchema)
