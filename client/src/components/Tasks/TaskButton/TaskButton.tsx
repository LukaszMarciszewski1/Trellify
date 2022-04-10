import React from 'react'
import styles from './styles.module.scss'


type ButtonProps = {
  icon?: any
  height?: string
  margin?: string
  name: string
  onClick: () => void
}

const TaskButton: React.FC<ButtonProps> = ({ onClick, name, icon, height, margin }) => {
  return (
    <button style={{height: height, margin: margin}} className={styles.taskButton} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>
      {name}
    </button>
  )
}

export default TaskButton
