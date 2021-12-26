import React from 'react'
import styles from './styles.module.scss'
import {
  useGetAllTasksQuery,
} from "../../store/api/listsReducer";
// import Task from './Task/Task'



const Tasks = () => {

  return (
    <div className={styles.tasks}>
    {/* <Task
      taskID={task._id}
      title={task.title}
      description={task.description}
      completed={task.completed}
      createdDate={task.createdDate}
      deadline={task.deadline}
    /> */}
    </div>
  )
}

export default Tasks
