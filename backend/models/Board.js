import mongoose from 'mongoose'
const { Schema } = mongoose

const BoardSchema = mongoose.Schema({
  title: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  listOrder: Schema.Types.ObjectId,
  // lists: [
  // {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Board',
  //   required: true,
  // }
  // ]
},
{
  toJSON: {
    virtuals: true
  }
}
)
BoardSchema.virtual("lists", {
  ref: "List",
  localField: "_id",
  foreignField: "boardId",
  justOne: false,             
});
const Board = mongoose.model('Board', BoardSchema)

export default Board
