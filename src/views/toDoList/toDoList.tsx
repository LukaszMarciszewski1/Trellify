import React, {useEffect, useState, SyntheticEvent} from 'react'
import styles from './styles.module.scss'

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { addTodo, removeTodo, changeStatus } from '../../store/todosReducer/todosReducer';

import Task from '../../components/Task/Task'
import Tabs from '../../components/Tabs/Tabs'
import TabsContent from '../../components/Tabs/TabsContent/TabsContent'
import Form from '../../components/Form/Form'

const ToDoList: React.FC = () => {
  const [todoDescription, setTodoDescription] = useState<string>('');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const todoList = useSelector((state: RootState) => state.todolist);
  const dispatch = useDispatch<AppDispatch>();
  const numberOfTasks = todoList.filter(task => task.completed === false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addTodo(todoTitle, todoDescription))
    setTodoTitle('')
    setTodoDescription('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
  }

  const displayTasks = (item: any ) => (
    <Task 
      key={item.id} 
      title={item.title}
      completed={item.completed}
      description={item.description} 
      handleRemove={() => dispatch(removeTodo(item.id))}
      handleChangeStatus={()=> dispatch(changeStatus({completed: !item.completed, id: item.id}))}
    />
  )

  return (
    <div className={styles.container}>
      <Tabs>
        <TabsContent title="Do zrobienia">
          {todoList.slice(0).reverse().map(item => (
           item.completed === false ?
           displayTasks(item)
           :
            null
          ))}
        </TabsContent>
        <TabsContent title="Zrobione">
        {todoList.slice(0).reverse().map(item => (
           item.completed === true ?
            displayTasks(item) :
            null
          ))}
        </TabsContent>
        <TabsContent title="Dodaj zadanie">
        <Form 
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          titleValue={todoTitle}
          descriptionValue={todoDescription}
        />
        <br />
        <h2>zadania do zrobienia {numberOfTasks.length}</h2>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ToDoList
