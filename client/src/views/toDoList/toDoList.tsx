import React, { useEffect, useState, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './styles.module.scss'

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

import { 
  useGetAllTasksQuery, 
  useAddTaskMutation, 
  useRemoveTaskMutation, 
  useUpdateTaskMutation,
  useCompletedTaskMutation } from "../../store/todosReducer/todosReducer";

import Task from '../../components/Task/Task'
import Tabs from '../../components/Tabs/Tabs'
import TabsContent from '../../components/Tabs/TabsContent/TabsContent'
import Form from '../../components/Form/Form'

const ToDoList: React.FC = () => {
  // const todoList = useSelector((state: RootState) => state);
  // const dispatch = useDispatch<AppDispatch>();
  const [todoDescription, setTodoDescription] = useState<string>('');
  const [todoTitle, setTodoTitle] = useState<string>('');

  const { data, error, isLoading } = useGetAllTasksQuery();
  const [addTask] = useAddTaskMutation()
  const [removeTask] = useRemoveTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const [completedTask] = useCompletedTaskMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addTask({
      title: todoTitle,
      description: todoDescription
    })
    setTodoTitle('')
    setTodoDescription('')
  }

  const numberOfTasks = data?.filter(task => task.completed === 0)

  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>error</h2>

  return (
    <div className={styles.container}>
      <Tabs>
        <TabsContent title="Do zrobienia">
          {
            data?.slice(0).reverse().map(item => (
              <Task
                key={item._id}
                title={item.title}
                completed={item.completed}
                description={item.description}
                handleRemove={() => removeTask(item._id)}
                handleChangeStatus={() => completedTask({id: item._id, completed: item.completed + 1})}
                handleUpdate={() => updateTask(item._id)}
              />
            ))
          }
        </TabsContent>
        <TabsContent title="Zrobione">
        </TabsContent>
        <TabsContent title="Dodaj zadanie">
          <Form
            handleSubmit={handleSubmit}
            handleChange={handleChange}
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
