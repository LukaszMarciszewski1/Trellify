import mongoose from 'mongoose'
const { Schema } = mongoose

const ListSchema = mongoose.Schema(
  {
    title: String,
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
    },
    cards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const List = mongoose.model('List', ListSchema)

export default List
