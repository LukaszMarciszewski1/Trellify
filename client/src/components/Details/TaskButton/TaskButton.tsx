import React from 'react'
import styles from './styles.module.scss'
interface TaskButtonProps {
  icon?: {}
  name?: string
  onClick: () => void
  style?: {}
}

const TaskButton: React.FC<TaskButtonProps> = ({ onClick, name, icon, style }) => {
  return (
    <button className={styles.taskButton} onClick={onClick} style={style}>
      <div className={styles.icon}>{icon}</div>
      {name}
    </button>
  )
}

export default TaskButton
