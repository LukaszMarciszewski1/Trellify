import mongoose from 'mongoose'

const CardSchema = mongoose.Schema({
  title: String,
  description: String,
  deadline: String,
  listId: String,
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
