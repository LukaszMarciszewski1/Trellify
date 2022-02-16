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
    listOrder: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  },
  // {
  //   timestamps: true,
  // }
)

BoardSchema.statics.getBoardAndLists = (_id) => {
  return Board.find({ _id }).populate({
    path: 'lists',
    // populate: {
    //   path: 'cards',
    //   populate: {
    //     path: 'members'
    //   }
    // }
  })
}

BoardSchema.statics.updateOne = (id, data) => {
  return Board.findByIdAndUpdate(id, data)
}

const Board = mongoose.model('Board', BoardSchema)

export default Board
