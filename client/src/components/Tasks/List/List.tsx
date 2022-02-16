import React, { useEffect, useState, useCallback, useRef, PropsWithoutRef } from 'react'
import styles from './styles.module.scss'
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TextareaAutosize from 'react-textarea-autosize';
import TaskForm from '../TaskForm/TaskForm';
import TaskButton from '../TaskButton/TaskButton';
import IconButton from '../../Details/IconButton/IconButton'
import { BsThreeDots } from "react-icons/bs";





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
import Card from '../Card/Card';
import useOnClickOutside from '../../../hooks/useOnClickOutside';




type Props = {
  listId: string
  title?: string
  index: number
  boardId: string
  cards?: []
  onClickDelete?: () => void
  changeIndex?: () => void
}
const List: React.FC<Props> = ({ title, listId, index, cards, boardId, onClickDelete }) => {
  const ref = useRef(null)
  const [addCard] = useAddCardMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const [updateList] = useUpdateTaskMutation()

  const [cardTitle, setCardTitle] = useState<string>('')
  const [toggleForm, setToggleForm] = useState<boolean>(false)
  // console.log(toggleForm)

  const handleToggleTaskForm = () => {
    setToggleForm(form => !form)
  }

  const handleChangeTaskValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setCardTitle(e.target.value)
  }

  const handleAddCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): void => {
    e.preventDefault()
    if (cardTitle.length === 0) return
    addCard({
      listId: listId,
      title: cardTitle,
    })
    updateBoard({
      id: boardId,
    })
    setToggleForm(false)
    setCardTitle('')
  }

  const handleClickOutside = () => {setToggleForm(false); setCardTitle('')}
  useOnClickOutside(ref, handleClickOutside)

  const handleBlur = () => {
    // setToggleForm(false)
    // setCardTitle('')
  }

  return (
    <div>
      <Draggable draggableId={String(listId)} index={index}>
        {provided => (
          <div className={styles.container} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
            <div className={styles.listHeader}>
              <TextareaAutosize
                autoFocus={true}
                value={title}
                className={styles.textarea}
                id='task-title'
                required
              />
              <IconButton onClick={onClickDelete} title={''} ><BsThreeDots style={{ fontSize: "1.3em" }} /></IconButton>
            </div>
            <Droppable droppableId={String(listId)} type="card">
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {
                    cards?.map((card: { listId: string; _id: string; title: string; updateDate: Date }, index: number) => (
                      <Card
                        index={index}
                        key={card._id}
                        id={card._id}
                        title={card.title}
                        updateDate={card.updateDate}
                        // listId={listId}
                        onClickDelete={() => {
                          deleteCard(card._id);
                          updateBoard({ id: boardId })
                        }}
                      />
                    ))
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className={styles.actionsList}>
              {toggleForm ?
                <div ref={ref}>
                  <TaskForm
                    handleChange={handleChangeTaskValue}
                    handleSubmit={(e) => handleAddCard(e, listId)}
                    toggleState={() => setToggleForm(false)}
                    title={cardTitle}
                    placeholder={'Dodaj listę zadań'}
                    onBlur={handleBlur}
                  />
                </div>
                : <TaskButton onClick={handleToggleTaskForm} />
              }
            </div>
          </div>
        )
        }
      </Draggable>
    </div>
  )
}

export default List

