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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addTodo(todoTitle, todoDescription))
    setTodoTitle('')
    setTodoDescription('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
  }

  return (
    <div className={styles.container}>
      <Tabs>
        <TabsContent title="Do zrobienia">
          {todoList.map(item => (
           item.completed === false ?
            <Task 
            key={item.id} 
            title={item.title}
            completed={item.completed}
            description={item.description} 
            handleRemove={() => dispatch(removeTodo(item.id))}
            handleChangeStatus={()=> dispatch(changeStatus({completed: !item.completed, id: item.id}))}
            /> :
            null
          ))}
        </TabsContent>
        <TabsContent title="Zrobione">
        {todoList.map(item => (
           item.completed === true ?
            <Task 
            key={item.id} 
            title={item.title}
            description={item.description} 
            completed={item.completed}
            handleRemove={() => dispatch(removeTodo(item.id))}
            handleChangeStatus={()=> dispatch(changeStatus({completed: !item.completed, id: item.id}))}
            /> :
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
        <h2>zadania do zrobienia {todoList.length}</h2>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ToDoList
