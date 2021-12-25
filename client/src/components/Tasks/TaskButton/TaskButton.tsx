import React from 'react'
import styles from './styles.module.scss'

type ButtonProps = {
  onClick: () => void
}

const TaskButton: React.FC<ButtonProps> = ({onClick}) => {
  return (
    <button className={styles.taskButton} onClick={onClick}>
      + Dodaj listę zadań
    </button>
  )
}

export default TaskButton
