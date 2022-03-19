import React, { useEffect, useState, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './styles.module.scss'
import dayjs from 'dayjs';
import {
  useGetAllTasksQuery,
  useAddTaskMutation,
} from "../../store/reducers/listsReducer";
// import { nowDate } from '../../hooks/nowDate';
// import Task from '../../components/Tasks/Task/Task'
// import Tasks from '../../components/Tasks/Tasks';
import Tabs from '../../components/Details/Tabs/Tabs'
import TabsContent from '../../components/Details/Tabs/TabsContent/TabsContent'
import Form from '../../components/Details/Form/Form'
import IconButton from '../../components/Details/IconButton/IconButton';
import addTaskIcon from '../../assets/icons/plus-circle.svg'

const ToDoList: React.FC = () => {
  // const [todoTitle, setTodoTitle] = useState<string>('');
  // const [todoDescription, setTodoDescription] = useState<string>('');
  // const [deadline, setDeadline] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'))
  // const [showForm, setShowForm] = useState<boolean>(false)

  // const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  // const [addTask] = useAddTaskMutation()

  // const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   if(e.target.id === 'task-title') setTodoTitle(e.target.value)
  //   if(e.target.id === 'task-description') setTodoDescription(e.target.value)
  //   if(e.target.id === 'task-deadline') setDeadline(e.target.value)
  // }

  // const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if(todoTitle.length > 0 && todoDescription.length > 0){
  //     addTask({
  //       title: todoTitle,
  //       description: todoDescription,
  //       deadline: deadline,
  //       createdDate: nowDate()
  //     })
  //     setTodoTitle('')
  //     setTodoDescription('')
  //     setTimeout(() => setShowForm(false), 400)
  //   }
  //   else alert('uzupełnij pole')
  // }

  // const displayTasks = (task: any) => (
  //   <Task
  //     key={task._id}
  //     taskID={task._id}
  //     title={task.title}
  //     description={task.description}
  //     completed={task.completed}
  //     createdDate={task.createdDate}
  //     deadline={task.deadline}
  //     // nowDate={nowDate}
  //   />
  // )

  // const sortedTasks = tasks?.slice().sort((a, b) => +new Date(b.createdDate) - +new Date(a.createdDate))

  // const numberOfTasks = tasks?.filter(task => task.completed === 0)

  // if (isLoading) return <h2>Loading...</h2>
  // if (error) return <h2>error</h2>

  return (
    <div className={styles.container}>
      {/* <Tabs>
        <TabsContent title="Zlecenia">
          <div className={styles.wrapperTasks}>
            <div className={styles.column}>
              <div className={styles.header}>
                <h3>Do zrobienia</h3>
                <IconButton padding={'0'} icon={addTaskIcon} onClick={() => setShowForm(prev => !prev)} />
              </div>
              {
                showForm ? (
                  <Form
                    handleSubmit={handleAddTask}
                    handleChange={handleChangeValue}
                    titleValue={todoTitle}
                    descriptionValue={todoDescription}
                    deadline={deadline}
                  />
                ) : null
              }
              <div className={styles.containerTasks}>
              {
                  tasks?.slice(0).reverse().map(task => (
                    task.completed === 0 ? (
                      <Tasks 
                        key={task._id} 
                        _id={task._id} 
                        title={task.title} 
                        description={task.description} 
                        completed={task.completed} 
                        createdDate={task.createdDate} 
                        deadline={task.deadline}
                      />
                    ) : null
                  ))
                }
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.header}>
                <h3>W realizacji</h3>
              </div>
                {
                  sortedTasks?.map(task => (
                    task.completed === 1 ? (
                      <Tasks 
                      key={task._id} 
                      _id={task._id} 
                      title={task.title} 
                      description={task.description} 
                      completed={task.completed} 
                      createdDate={task.createdDate} 
                      deadline={task.deadline}
                    />
                    ) : null
                  ))
                }
            </div>
            <div className={styles.column}>
              <div className={styles.header}><h3>Zrobione</h3></div>
              {
                  sortedTasks?.map(task => (
                    task.completed === 2 ? (
                      <Tasks 
                      key={task._id} 
                      _id={task._id} 
                      title={task.title} 
                      description={task.description} 
                      completed={task.completed} 
                      createdDate={task.createdDate} 
                      deadline={task.deadline}
                    />
                    ) : null
                  ))
                }
            </div>
          </div>
        </TabsContent>
        <TabsContent title="Statystyki">
        <br />
          <h2>Zlecenia do zrobienia: {numberOfTasks?.length}</h2> <br/>
          <h2>Wykorzystane materiały</h2> <br/>
          <h2>Itp.</h2>
        </TabsContent>
        <TabsContent title="Notatki">
          <br />
          <h2>zadania do zrobienia {numberOfTasks?.length}</h2>
        </TabsContent>
      </Tabs> */}
    </div>
  )
}

export default ToDoList
