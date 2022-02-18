import React from 'react'
import styles from './styles.module.scss'

type ButtonProps = {
  icon?: any
  name: string
  openForm: () => void
}

const TaskButton: React.FC<ButtonProps> = ({ openForm, name, icon }) => {

  // const name = id === 'list' ? 'Dodaj listę zadań' : 'Dodaj nową kartę'
  return (
    <button className={styles.taskButton} onClick={openForm}>
      <div className={styles.icon}>{icon}</div>
      {name}
    </button>
  )
}

export default TaskButton
