import mongoose from 'mongoose'
const { Schema } = mongoose

const CardSchema = mongoose.Schema({
  title: String,
  description: String,
  deadline: String,
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
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateddAt: {
    type: Date,
    default: null,
  },
},
{
  timestamps: true
})

CardSchema.statics.updateOne = (id, data) => {
  return Card.findByIdAndUpdate(id, data);
}

const Card = mongoose.model('Card', CardSchema)

export default Card
