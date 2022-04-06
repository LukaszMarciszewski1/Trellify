import mongoose from 'mongoose'
const { Schema } = mongoose

const FileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    size: Number,
    lastModifiedDate: {
      type: Date,
      default: new Date
    }
  },
  {
    timestamps: true,
  }
)

const File  = mongoose.model('File', FileSchema)

export default File