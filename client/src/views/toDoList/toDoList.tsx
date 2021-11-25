import React, { useEffect, useState, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './styles.module.scss'
import {
  useGetAllTasksQuery,
  useAddTaskMutation,
} from "../../store/todosReducer/todosReducer";
import Task from '../../components/Task/Task'
import Tabs from '../../components/Tabs/Tabs'
import TabsContent from '../../components/Tabs/TabsContent/TabsContent'
import Form from '../../components/Form/Form'
import IconButton from '../../components/Details/IconButton/IconButton';
import addTaskIcon from '../../assets/icons/plus-circle.svg'

const ToDoList: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [todoDescription, setTodoDescription] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false)

  const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  const [addTask] = useAddTaskMutation()

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
  }
  const date = new Date();
  const now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  const nowDate = new Date(now_utc)

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addTask({
      title: todoTitle,
      description: todoDescription,
      createdDate: nowDate
    })
    setTodoTitle('')
    setTodoDescription('')
    setTimeout(() => setShowForm(false), 400)
  }

  const displayTasks = (task: any) => (
    <Task
      key={task._id}
      taskID={task._id}
      title={task.title}
      description={task.description}
      completed={task.completed}
      createdDate={task.createdDate}
      nowDate={nowDate}
    />
  )
  
  const sortedTasks = tasks?.slice().sort((a, b) => +new Date(b.createdDate) - +new Date(a.createdDate))

  const numberOfTasks = tasks?.filter(task => task.completed === 0)
  
  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>error</h2>

  return (
    <div className={styles.container}>
      <Tabs>
        <TabsContent title="Zlecenia">
          <div className={styles.wrapperTasks}>
            <div className={styles.column}>
              <div className={styles.header}>
                <h3>Do zrobienia</h3>
                <IconButton padding={'0'} icon={addTaskIcon} onClick={() => setShowForm(prev => !prev)}/>
              </div>
              {
                showForm ? (
                  <Form
                  handleSubmit={handleAddTask}
                  handleChange={handleChangeValue}
                  titleValue={todoTitle}
                  descriptionValue={todoDescription}
                />
                ) : null
              }
              <div className={styles.tasks}>
              {
                tasks?.slice(0).reverse().map(task => (
                  task.completed === 0 ? (
                    displayTasks(task)
                  ) : null
                ))
              }
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.header}>
                <h3>W realizacji</h3>
              </div>
              <div className={styles.tasks}>
              {
                sortedTasks?.map(task => (
                  task.completed === 1 ? (
                    displayTasks(task)
                  ) : null
                ))
              }
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.header}><h3>Zrobione</h3></div>
              <div className={styles.tasks}>
              {
                sortedTasks?.map(task => (
                  task.completed >= 2 ? (
                    displayTasks(task)
                  ) : null
                ))
              }
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent title="Statystyki">
          {
            tasks?.slice(0).map(task => (
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
          <br />
          <h2>zadania do zrobienia {numberOfTasks?.length}</h2>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ToDoList
