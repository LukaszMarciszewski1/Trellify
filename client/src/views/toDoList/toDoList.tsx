import React, { useEffect, useState, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './styles.module.scss'

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from "../../store/todosReducer/todosReducer";

import Task from '../../components/Task/Task'
import Tabs from '../../components/Tabs/Tabs'
import TabsContent from '../../components/Tabs/TabsContent/TabsContent'
import Form from '../../components/Form/Form'
import Modal from '../../components/Modal/Modal';
import { idText } from 'typescript';

const ToDoList: React.FC = () => {
  // const todoList = useSelector((state: RootState) => state);
  // const dispatch = useDispatch<AppDispatch>();
  const [todoDescription, setTodoDescription] = useState<string>('');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [editTask, setEditTask] = useState<boolean>(true)

  const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  const [addTask] = useAddTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
    console.log(e.target.value)
  }

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addTask({
      title: todoTitle,
      description: todoDescription
    })
    setTodoTitle('')
    setTodoDescription('')
  }

  const submitSaveEdit = (e: React.FormEvent<HTMLFormElement>, taskId: string) => {
    e.preventDefault()
    updateTask({ 
      id: taskId,
      title: todoTitle,
      description: todoDescription
    })
    setTodoTitle('')
    setTodoDescription('')
    setEditTask(true)
  }
  // e: React.MouseEvent<HTMLElement>, 
  //event.currentTarget
  const handleToggleEdit = (id: string) => {
    setEditTask(prev => !prev)
    const select = tasks?.filter(task => {
      if(task._id === id) return true
      else return false
    })
    console.log(id)
  }

  const numberOfTasks = tasks?.filter(task => task.completed === 0)

  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>error</h2>

  return (
    <div className={styles.container}>
      <Tabs>
        <TabsContent title="Do zrobienia">
          {
            tasks?.slice(0).reverse().map(task => (
              task.completed === 0 ? (
                <Task
                  key={task._id}
                  title={editTask ? task.title : todoTitle}
                  description={editTask ? task.description : todoDescription}
                  completed={task.completed}
                  handleRemove={() => deleteTask(task._id)}
                  handleChangeStatus={() => updateTask({ id: task._id, completed: task.completed + 1 })}
                  saveEdit={(e)=> submitSaveEdit(e, task._id)}
                  disabled={editTask}
                  onChangeTask={handleChangeValue}
                  handleOpenEdit={()=>handleToggleEdit(task._id)}
                />
              ) : null
            ))
          }
          {/* <Modal /> */}
        </TabsContent>
        <TabsContent title="Zrobione">
          {
            tasks?.slice(0).reverse().map(task => (
              task.completed >= 1 ? (
                <Task
                  key={task._id}
                  title={task.title}
                  completed={task.completed}
                  description={task.description}
                  handleRemove={() => deleteTask(task._id)}
                />
              ) : null
            ))
          }
        </TabsContent>
        <TabsContent title="Dodaj zadanie">
          <Form
            handleSubmit={handleAddTask}
            handleChange={handleChangeValue}
            titleValue={todoTitle}
            descriptionValue={todoDescription}
          />
          <br />
          <h2>zadania do zrobienia {numberOfTasks?.length}</h2>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ToDoList
