import React from 'react'
import Task from './Task'

import { useGetAllTasksQuery } from "../../store/todosReducer/todosReducer";


const Tasks = (tasks:[]) => {
  // const { data: tasks, error, isLoading } = useGetAllTasksQuery();

  // const displayTasks = (task: any) => (
  //   <Task
  //     key={task._id}
  //     taskID={task._id}
  //     title={task.title}
  //     description={task.description}
  //     completed={task.completed}
  //   />
  // )

  // if (isLoading) return <h2>Loading...</h2>
  // if (error) return <h2>error</h2>

  return (
    <div>
      {/* {
        tasks?.slice(0).reverse().map((task) => (
          task.completed === 0 ? (
            displayTasks(task)
          ) : task.completed >= 1 ? (
            displayTasks(task)
          ) : null
        ))
      } */}
    </div>
  )
}

export default Tasks
