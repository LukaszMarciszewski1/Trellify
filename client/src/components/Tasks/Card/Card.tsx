import React, { useState } from 'react'
// import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';

import CardDetails from '../CardDetails/CardDetails';
import TextareaAutosize from 'react-textarea-autosize';
import {
  // useGetAllTasksQuery,
  // useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  // useAddCardMutation,
} from "../../../store/reducers/listsReducer";
import {
  // useGetAllBoardsQuery,
  // useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'
import {
  // useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";

import { BsPencil } from 'react-icons/bs';
import TaskButton from '../TaskButton/TaskButton';
import IconButton from '../../Details/IconButton/IconButton';

type Props = {
  boardId: string
  title: string
  description: string
  listId?: string
  cardId: string
  index: number
  updateDate?: Date
  onClickDelete?: () => void
  dragDisabled: (value: boolean) => void
  nameList: string | undefined
  // setOpenCardDetails: () => void
  // openCardDetails: () => void
}

const Card: React.FC<Props> = ({ cardId, boardId, title, index, onClickDelete, dragDisabled, nameList, description }) => {
  const [deleteCard] = useDeleteCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const [updateBoard] = useUpdateBoardMutation()
  const [openCardDetails, setOpenCardDetails] = useState<boolean>(false)
  console.log(description)
  return (
    <div>
      {
        openCardDetails ? <CardDetails
          nameList={nameList}
          cardId={cardId}
          title={title}
          description={description}
          boardId={boardId}
          setOpenCardDetails={() => {
            setOpenCardDetails(false)
            dragDisabled(false)
          }} /> : null
      }
      <Draggable draggableId={String(cardId)} index={index} >
        {provided => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
            <div className={styles.card} onClick={() => {
              setOpenCardDetails(true)
              dragDisabled(true)
            }}>
              <div className={styles.cardContainer}>
                <h3>{title}</h3>
              </div>
              <IconButton onClick={() => {
                deleteCard(cardId);
                setOpenCardDetails(false)
                updateBoard({ id: boardId })
              }}>
                <BsPencil />
              </IconButton>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  )
}

export default Card
