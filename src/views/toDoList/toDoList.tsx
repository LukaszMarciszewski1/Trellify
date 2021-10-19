import React, {useEffect, useState, SyntheticEvent} from 'react'
import { addTodo  } from '../../store/todosReducer/todosReducer';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import styles from './styles.module.scss'

import Task from '../../components/Task/Task'
import Tabs from '../../components/Tabs/Tabs'
import TabsContent from '../../components/Tabs/TabsContent/TabsContent'
import Form from '../../components/Form/Form'

const ToDoList: React.FC = () => {
  const [todoDescription, setTodoDescription] = useState('');
  const todoList = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addTodo(todoDescription))
  }

  return (
    <div className={styles.container}>
      <Tabs>
        <TabsContent title="Do zrobienia">
          <Task />
          <Task />
          <Task />
        </TabsContent>
        <TabsContent title="Zrobione">Zrobione</TabsContent>
        <TabsContent title="Dodaj zadanie">
        <Form 
          handleSubmit={handleSubmit}
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodoDescription(e.target.value)}
        />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ToDoList
