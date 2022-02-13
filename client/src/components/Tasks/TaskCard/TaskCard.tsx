import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import { Draggable } from 'react-beautiful-dnd';
type Props = {
  title: string
  listId?: string
  id: string
  index: number
  updateDate?: Date
  onClickDelete?: () => void
}

const TaskCard: React.FC<Props> = ({ title, listId, id, index, onClickDelete }) => {
  return (
    <Draggable draggableId={String(id)} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
          <div className={styles.card}>
            <h4>{title}</h4>
            <p>listId: {listId}</p>
            <p>cardId: {id}</p>
            <button onClick={onClickDelete}>X</button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard
