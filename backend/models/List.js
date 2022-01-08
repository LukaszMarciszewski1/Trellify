import mongoose from 'mongoose'
const { Schema } = mongoose

const ListSchema = mongoose.Schema({
  title: String,
  index: Number,
  sourceIndex: Number,
  destinationIndex: Number,
  sortIndex: Number,
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    // required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateddAt: {
    type: Date,
    default: null,
  },
  
})
// ListSchema.virtual('id').get(() => this._id)
const List = mongoose.model('List', ListSchema)

export default List
