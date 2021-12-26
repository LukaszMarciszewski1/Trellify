import mongoose from 'mongoose'
const { Schema } = mongoose

const CardSchema = mongoose.Schema({
  title: String,
  description: String,
  deadline: String,
  listId: {
    type: Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
  completed: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
})

const Card = mongoose.model('Card', CardSchema)

export default Card
