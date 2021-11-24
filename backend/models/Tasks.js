import mongoose from 'mongoose';

const TasksSchema = mongoose.Schema({
  title: String,
  description: String,
  completed: {
    type: Number,
    default: 0,
},
createdAt: {
  type: Date,
  default: new Date()
},
})

const Tasks = mongoose.model('Task', TasksSchema)

export default Tasks