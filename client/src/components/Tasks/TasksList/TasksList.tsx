import React, { useEffect, useState, useCallback, useRef, PropsWithoutRef } from 'react'
import styles from './styles.module.scss'
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TextareaAutosize from 'react-textarea-autosize';
import TaskForm from '../TaskForm/TaskForm';
import TaskButton from '../TaskButton/TaskButton';
import {
  useGetAllTasksQuery,
  // useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  // useAddCardMutation,
} from "../../../store/api/listsReducer";
import {
  useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/api/cardsReducer";
import TaskCard from '../TaskCard/TaskCard';

type Props = {
  id: string
  title: string
  index: number
  onClickDelete: () => void
}
const TasksList: React.FC<Props> = ({ title, onClickDelete, children, id, index }) => {
  // const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  const { data: cards, error, isLoading } = useGetAllCardsQuery();
  const [addCard] = useAddCardMutation()
  // const [addTask] = useAddTaskMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()

  const [cardTitle, setCardTitle] = useState<string>('')
  const [toogleForm, setToogleForm] = useState<boolean>(false)

  const handleToogleTaskForm = () => {
    setToogleForm(form => !form)
  }
  const handleChangeTaskValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setCardTitle(e.target.value)
  }
  const handleAddCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): void => {

    e.preventDefault()
    addCard({
      //  listId:id,
      //  title: cardTitle,
      //  id,
      listId: id,
      title: cardTitle,
    })
  }

  return (
    <Draggable draggableId={String(id)} index={index}>
      {provided => (
        <div className={styles.tasksList} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
          <div>
            <TextareaAutosize
              autoFocus={true}
              value={title}
              className={styles.textarea}
              id='task-title'
              required />
            <Droppable droppableId="all-lists" direction="horizontal" type="list">
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {/* {
                    cards?.map((card, index) => (
                      <TaskCard index={index} key={card._id} id={card._id} title={card.title} listId={''} />
                    ))
                  } */}
                  {children}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className={styles.actionList}>
              <button onClick={onClickDelete}>X</button>
              <TaskButton onClick={handleToogleTaskForm} />
              {toogleForm ?
                <TaskForm
                  handleChange={handleChangeTaskValue}
                  handleSubmit={(e) => handleAddCard(e, id)}
                  titleValue={cardTitle}
                  placeholder={'dodaj listę zadań'}
                />
                : null
              }
            </div>
            {/* {provided.placeholder} */}
          </div>
        </div>
      )
      }
    </Draggable>
  )
}

export default TasksList
