import React, { useState } from 'react'
// import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';

import CardDetails from '../CardDetails/CardDetails';
import TextareaAutosize from 'react-textarea-autosize';
import {
  // useGetAllCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from "../../../store/reducers/cardsReducer";

type Props = {
  boardId: string
  title: string
  description: string
  listId?: string
  cardId: string
  index: number
  updateDate?: Date
  onClickDelete: () => void
  dragDisabled: (value: boolean) => void
  nameList: string | undefined
  // setOpenCardDetails: () => void
  // openCardDetails: () => void
}

const Card: React.FC<Props> = ({ cardId, boardId, title, index, onClickDelete, dragDisabled, nameList, description }) => {
  const [openCardDetails, setOpenCardDetails] = useState<boolean>(false)

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
              <h3>{title}</h3>
              {/* <TextareaAutosize
                id='card'
                className={styles.textarea}
                autoFocus={false}
                value={title}
                // onBlur={() => console.log('close')}
                required
              /> */}
              <button onClick={onClickDelete}>X</button>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  )
}

export default Card
