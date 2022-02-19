import React from 'react'
// import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';

type Props = {
  title: string
  listId?: string
  cardId: string
  index: number
  updateDate?: Date
  onClickDelete: () => void
  openCardDetails: () => void
}

const Card: React.FC<Props> = ({ title, cardId, index, onClickDelete, openCardDetails }) => {
  return (
    <Draggable draggableId={String(cardId)} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
          <div className={styles.card} onClick={openCardDetails}>
            <h3>{title}</h3>
            <button onClick={onClickDelete}>X</button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Card
