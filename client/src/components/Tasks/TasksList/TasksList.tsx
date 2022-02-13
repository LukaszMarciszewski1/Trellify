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
  useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/api/boardsReducer'
import {
  useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/api/cardsReducer";
import TaskCard from '../TaskCard/TaskCard';

type Props = {
  id: string
  title?: string
  index: number
  boardId: string
  cards?: []
  onClickDelete?: () => void
  changeIndex?: () => void
}
const TasksList: React.FC<Props> = ({ title, onClickDelete, changeIndex, children, id, index, cards }) => {
  // const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  // const { data: cards, error, isLoading } = useGetAllCardsQuery();
  const [addCard] = useAddCardMutation()
  // const [addTask] = useAddTaskMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const [updateList] = useUpdateTaskMutation()

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
      boardId: '6208d6bf1bb693481233f6fb',
      listId: id,
      title: cardTitle,
    })

    updateBoard({
      id: '6208d6bf1bb693481233f6fb',
      // id: id,
      // cards: cards,
    })
    setCardTitle('')
  }
  // if (isLoading) return <h2>Loading...</h2>
  // if (error) return <h2>error</h2>
  return (
    <div>
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
              <p>{id}</p>
              <Droppable droppableId={String(id)} type="card">
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {
                      cards?.map((card: { listId: string; _id: string; title: string }, index: number) => (
                        card.listId === id ? (
                          <TaskCard
                            index={index}
                            key={card._id}
                            id={card._id}
                            title={card.title}
                            listId={id}
                            onClickDelete={() => deleteCard(card._id)} />
                        ) : null
                      ))
                    }
                    {/* {children} */}
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
            </div>
          </div>
        )
        }
      </Draggable>
    </div>
  )
}

export default TasksList
