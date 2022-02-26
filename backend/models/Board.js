import mongoose from 'mongoose'
const { Schema } = mongoose

const BoardSchema = mongoose.Schema(
  {
    title: String,
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    background: String,
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    labels: [
      {
        color: {
          type: String,
          default: '#61bd4f',
        },
        title: String,
        active: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Board = mongoose.model('Board', BoardSchema)

export default Board
