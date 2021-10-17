import React from 'react'
import styles from './styles.module.scss'

import Task from '../../components/Task/Task'

const toDoTask:React.FC = () => {
  return (
    <div className={styles.container}>
      <Task />
      do zrobienia
    </div>
  )
}

export default toDoTask
