import mongoose from 'mongoose'


const TasksSchema = mongoose.Schema({
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

const Tasks = mongoose.model('Task', TasksSchema)

export default Tasks
