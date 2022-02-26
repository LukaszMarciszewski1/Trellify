import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.scss'
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TextareaAutosize from 'react-textarea-autosize';
import TaskForm from '../TaskForm/TaskForm';
import TaskButton from '../TaskButton/TaskButton';
import IconButton from '../../Details/IconButton/IconButton'
import { BsThreeDots } from "react-icons/bs";

import { labelItems } from '../localData';

import {
  // useGetAllTasksQuery,
  // useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  // useAddCardMutation,
} from "../../../store/reducers/listsReducer";
import {
  // useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'
import {
  // useGetAllCardsQuery,
  useAddCardMutation,
  // useDeleteCardMutation,
  // useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";
import Card from '../Card/Card';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
// import { v4 as uuidv4 } from 'uuid';
// import { MdOutlineAdd } from "react-icons/md";
import { GoPlus } from "react-icons/go";
// import { dangerouslyDisableDefaultSrc } from 'helmet/dist/middlewares/content-security-policy';

type Props = {
  listId: string
  title: string
  index: number
  boardId: string
  cards: []

  // openCardDetails: (value: boolean) => void
}
const List: React.FC<Props> = ({ title, listId, index, cards, boardId }) => {
  const { data: board, error, isLoading } = useGetBoardQuery(boardId);
  const ref = useRef(null)
  const [addCard] = useAddCardMutation()
  // const [deleteCard] = useDeleteCardMutation()
  // const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const [updateList] = useUpdateTaskMutation()
  const [deleteList] = useDeleteTaskMutation()

  const [listTitle, setListTitle] = useState<string | undefined>(title)
  const [cardTitle, setCardTitle] = useState<string>('')
  const [openCardForm, setOpenCardForm] = useState<boolean>(false)
  const [openTitleForm, setOpenTitleForm] = useState<boolean>(false)
  const [dragDisabled, setDragDisabled] = useState<boolean>(false)
  const [labels, setLabels] = useState([] as any)

  useEffect(() => {
    if (board) {
      setLabels(board.labels)
    }
  }, [board])


  const handleChangeCardValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'card') setCardTitle(e.target.value)
  }

  const handleEditListTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.id === 'list') setListTitle(e.target.value)
    updateList({
      id: listId,
      title: e.target.value
    })

  }

  const handleAddCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    if (cardTitle.length === 0) return
    addCard({
      listId: listId,
      title: cardTitle,
      labels: labels
    })
    updateBoard({
      id: boardId,
    })

    setOpenCardForm(false)
    setCardTitle('')
  }

  const handleCloseForm = () => { setOpenCardForm(false); setCardTitle(''); }
  useOnClickOutside(ref, handleCloseForm)

  return (
    <div>
      <Draggable draggableId={String(listId)} index={index} isDragDisabled={dragDisabled}>
        {provided => (
          <div className={styles.container} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
            <div className={styles.listHeader} onClick={() => setOpenTitleForm(true)} ref={ref}>
              {
                openTitleForm ?
                  <div className={styles.textWrapper}>
                    <TextareaAutosize
                      id='list'
                      autoFocus={true}
                      value={listTitle}
                      className={styles.textarea}
                      onChange={handleEditListTitle}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => setOpenTitleForm(false)}
                      required
                    />
                  </div>
                  : <div className={styles.textWrapper}><h2>{listTitle}</h2></div>
              }
              <IconButton onClick={() => {
                deleteList(listId);
                updateBoard({ id: boardId })
              }}><BsThreeDots style={{ fontSize: "1.3em" }} /></IconButton>
            </div>
            <Droppable droppableId={String(listId)} type="card">
              {provided => (
                <div className={styles.cardsContainer}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {
                    cards?.map((card: { listId: string; _id: string; title: string; updateDate: Date, labels: [], description: string }, index: number) => (
                      <Card
                        index={index}
                        key={card._id}
                        cardId={card._id}
                        boardId={boardId}
                        title={card.title}
                        description={card.description}
                        updateDate={card.updateDate}
                        cardLabels={card.labels}
                        nameList={listTitle}
                        dragDisabled={setDragDisabled}
                      />
                    ))
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className={styles.actionsList}>
              {openCardForm ?
                <div ref={ref}>
                  <TaskForm
                    id={'card'}
                    handleChange={handleChangeCardValue}
                    handleSubmit={handleAddCard}
                    closeForm={() => { setOpenCardForm(false); setCardTitle('') }}
                    value={cardTitle}
                  // onBlur={handleBlur}
                  />
                </div>
                : <TaskButton openForm={() => setOpenCardForm(true)} name={'Dodaj kartę'} icon={<GoPlus />} />
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

