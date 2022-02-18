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
} from "../../../store/reducers/listsReducer";
import {
  useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'
import {
  useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";
import Card from '../Card/Card';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { v4 as uuidv4 } from 'uuid';
// import { MdOutlineAdd } from "react-icons/md";
import { GrAdd } from "react-icons/gr";

type Props = {
  listId: string
  title: string
  index: number
  boardId: string
  cards: []
  onClickDelete?: () => void
  onChangeTitle?: (value: any) => void
}
const List: React.FC<Props> = ({ title, listId, index, cards, boardId }) => {
  const ref = useRef(null)
  const [addCard] = useAddCardMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const [updateList] = useUpdateTaskMutation()
  const [deleteList] = useDeleteTaskMutation()

  const [listTitle, setListTitle] = useState<string | undefined>(title)
  const [cardTitle, setCardTitle] = useState<string>('')
  const [toggleForm, setToggleForm] = useState<boolean>(false)
  const [toggleTitleList, setToggleTitleList] = useState<boolean>(false)
  const [tasks, setTasks] = useState(cards)

  const handleToggleTaskForm = () => {
    setToggleForm(form => !form)
  }

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
    })
    updateBoard({
      id: boardId,
    })

    setToggleForm(false)
    setCardTitle('')
  }

  const handleClickOutside = () => { setToggleForm(false); setCardTitle(''); }
  useOnClickOutside(ref, handleClickOutside)

  const handleBlur = () => {
    // setToggleForm(false)
    // setCardTitle('')
    setToggleTitleList(false)
  }
  // const selectAllText = (e: { target: { select: () => void; }; }) => {
  //   e.target.select();
  // };

  return (
    <div>
      <Draggable draggableId={String(listId)} index={index}>
        {provided => (
          <div className={styles.container} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
            <div className={styles.listHeader} onClick={() => setToggleTitleList(true)} ref={ref}>
              {
                toggleTitleList ?
                  <TextareaAutosize
                    id='list'
                    autoFocus={true}
                    value={listTitle}
                    className={styles.textarea}
                    onChange={handleEditListTitle}
                    onFocus={(e) => e.target.select()}
                    onBlur={handleBlur}
                    required
                  />
                  : <h2>{listTitle}</h2>
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
                    cards?.map((card: { listId: string; _id: string; title: string; updateDate: Date }, index: number) => (
                      <Card
                        index={index}
                        key={card._id}
                        cardId={card._id}
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
                    id={'card'}
                    handleChange={handleChangeCardValue}
                    handleSubmit={handleAddCard}
                    toggleState={() => setToggleForm(false)}
                    title={cardTitle}
                    onBlur={handleBlur}
                  />
                </div>
                : <TaskButton openForm={handleToggleTaskForm} name={'Dodaj nową kartę'} icon={<GrAdd />} />
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

