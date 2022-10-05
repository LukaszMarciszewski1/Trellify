import React from 'react'
import styles from './styles.module.scss'

interface TaskButtonProps {
  name: string
  onClick: () => void
  icon?: {}
  style?: {}
}

const TaskButton: React.FC<TaskButtonProps> = ({ onClick, name, icon, style }) => {
  return (
    <button className={styles.taskButton} onClick={onClick} style={style}>
      <div className={styles.icon}>{icon}</div>
      <span>{name}</span>
    </button>
  )
}

export default TaskButton
