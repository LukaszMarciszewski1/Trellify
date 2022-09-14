import mongoose, { Schema, Types } from 'mongoose'

const CardSchema = new Schema(
  {
    title: String,
    description: String,
    deadline: {
      type: Date || null,
      default: null
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: 'List',
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    cover: String,
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    labels: [
      {
        color: String,
        title: String,
        active: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Card = mongoose.model('Card', CardSchema)

export default Card
