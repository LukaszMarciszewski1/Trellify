import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'

type Props = {
  title: string
  listId: string
}

const TaskCard: React.FC<Props> = ({ title, listId}) => {
  return (
    <div className={styles.card}>
      <h4>{title}</h4>
      <p>{listId}</p>
    </div>
  )
}

export default TaskCard
