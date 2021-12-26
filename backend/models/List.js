import mongoose from 'mongoose'


const ListSchema = mongoose.Schema({
  title: String,
  cards: [
    {
      title: String,
      description: String,
      deadline: String,
      completed: {
        type: Number,
        default: 0
      },
      createdDate: {
        type: Date,
        default: new Date
      }
    }
  ],
})

const List = mongoose.model('List', ListSchema)

export default List
