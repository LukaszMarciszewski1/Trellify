import mongoose from 'mongoose'
const { Schema } = mongoose

const CardSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    sourceIndex: Number,
    destinationIndex: Number,
    sortIndex: Number,
    listId: {
      type: Schema.Types.ObjectId,
      ref: 'List',
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
    },
    completed: {
      type: Number,
      default: 0,
    },
    deadline: Date | null,
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updateDate: {
      type: Date,
      default: null,
    },
    position: Number,
    labels: [
      {
        color: String,
        title: String,
        active: Boolean,
      },
    ],
  }
  // {
  //   timestamps: true,
  // }
)

CardSchema.statics.updateOne = (id, data) => {
  return Card.findByIdAndUpdate(id, data)
}

const Card = mongoose.model('Card', CardSchema)

export default Card
