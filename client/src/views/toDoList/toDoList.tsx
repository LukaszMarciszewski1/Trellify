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
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [todoDescription, setTodoDescription] = useState<string>('');

  const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  const [addTask] = useAddTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
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

  // e: React.MouseEvent<HTMLElement>, 
  //event.currentTarget

  const displayTasks = (task:any) => (
    <Task
      key={task._id}
      taskID={task._id}
      title={task.title}
      description={task.description}
      completed={task.completed}
    // handleRemove={() => deleteTask(task._id)}
    // handleChangeStatus={() => updateTask({ id: task._id, completed: task.completed + 1 })}
    />
  )

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
                displayTasks(task)
              ) : null
            ))
          }
        </TabsContent>
        <TabsContent title="Zrobione">
          {
            tasks?.slice(0).reverse().map(task => (
              task.completed >= 1 ? (
                <Task
                  key={task._id}
                  taskID={task._id}
                  title={task.title}
                  completed={task.completed}
                  description={task.description}
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
