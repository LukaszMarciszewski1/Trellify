import React, { useEffect, useState, useCallback } from 'react'
import styles from './styles.module.scss'
import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetTaskQuery
} from "../../store/api/todosReducer";
import {
  useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
  useDeleteAllMutation,
} from "../../store/api/cardsReducer";
import TasksList from '../../components/Tasks/TasksList/TasksList'
import TaskButton from '../../components/Tasks/TaskButton/TaskButton'
import TaskForm from '../../components/Tasks/TaskForm/TaskForm'
import TaskCard from '../../components/Tasks/TaskCard/TaskCard';

const View1: React.FC = () => {
  const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  const { data: cards } = useGetAllCardsQuery();
  // const { data: carde } = useGetTaskQuery();

  const [addTask] = useAddTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [deleteCard] = useDeleteCardMutation()

  const [listTitle, setListTitle] = useState<string>('');
  const [toogleForm, setToogleForm] = useState<boolean>(false)
  const [taskValue, setTaskValue] = useState<string>('')

  const handleToogleTaskForm = () => {
    setToogleForm(form => !form)
  }

  const handleChangeTaskValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'task-title') setListTitle(e.target.value)
  }

  const handleSubmitTaskForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (listTitle.length > 0) {
      addTask({
        title: listTitle,
      })
      setListTitle('')
    }
    else alert('uzupełnij pole')
  }

  const handleDeleteList = () => {

  }


  return (
    <div className={styles.container}>
      {
        tasks?.map(list => (
          <TasksList
            id={list._id}
            key={list._id}
            title={list.title}
            onClickDelete={() => {
              deleteTask(list._id)

            }}
          >
            {
              list.cards.map(card => (
                <TaskCard key={card._id} title={card.title} listId={list._id} />
              ))
            }
            {/* {
              cards?.map(card => (
                card.listId === list._id ? (<TaskCard key={card._id} title={card.title} listId={list._id}/>) : null
              ))
            } */}
          </TasksList>
        ))
      }
      <div>
        {toogleForm ?
          <TaskForm
            handleChange={handleChangeTaskValue}
            handleSubmit={handleSubmitTaskForm}
            titleValue={listTitle}
            placeholder={'dodaj listę zadań'}
          />
          : null}
        <TaskButton onClick={handleToogleTaskForm} />
      </div>
    </div>

  )
}

export default View1
