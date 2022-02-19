import React, { useState } from 'react'
// import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';

import CardDetails from '../CardDetails/CardDetails';

type Props = {
  title: string
  listId?: string
  cardId: string
  index: number
  updateDate?: Date
  onClickDelete: () => void
  dragDisabled: (value: boolean) => void
  // setOpenCardDetails: () => void
  // openCardDetails: () => void
}

const Card: React.FC<Props> = ({ title, cardId, index, onClickDelete, dragDisabled }) => {
  const [openCardDetails, setOpenCardDetails] = useState<boolean>(false)

  const handleOpenCardDetails = () => setOpenCardDetails(true)


  return (
    <div>
      {
        openCardDetails ? <CardDetails title={title} setOpenCardDetails={() => {
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
              <button onClick={onClickDelete}>X</button>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  )
}

export default Card
