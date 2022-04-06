import mongoose from 'mongoose'
const { Schema } = mongoose

const CardSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    deadline: Date | null,
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
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updateDate: {
      type: Date,
      default: null,
    },
    files: {
      type: Schema.Types.ObjectId,
      ref: 'Files',
    },
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

CardSchema.statics.updateOne = (id, data) => {
  return Card.findByIdAndUpdate(id, data)
}

const Card = mongoose.model('Card', CardSchema)

export default Card
