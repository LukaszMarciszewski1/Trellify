import mongoose from 'mongoose';

const TasksSchema = mongoose.Schema({
  title: String,
  description: String,
  completed: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: new Date()
  },
  deadline: String,
})

const Tasks = mongoose.model('Task', TasksSchema)

export default Tasks