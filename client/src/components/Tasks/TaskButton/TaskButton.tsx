import React from 'react'
import styles from './styles.module.scss'
interface TaskButtonProps {
  icon?: {}
  height?: string
  margin?: string
  name: string
  onClick: () => void
}

const TaskButton: React.FC<TaskButtonProps> = ({ onClick, name, icon, height, margin }) => {
  return (
    <button style={{height: height, margin: margin}} className={styles.taskButton} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>
      {name}
    </button>
  )
}

export default TaskButton
