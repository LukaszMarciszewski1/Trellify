import mongoose from 'mongoose'

const CardSchema = mongoose.Schema({
  title: String,
  description: String,
  deadline: String,
  boardID: {
    type: String,
    required: true,
  },
  listId: {
    type: String,
    required: true,
  },
  completed: {
    type: Number,
    default: 0,
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

const Card = mongoose.model('Card', CardSchema)

export default Card
