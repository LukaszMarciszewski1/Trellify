import React from 'react'
import styles from './styles.module.scss'
import TaskButton from '../TaskButton/TaskButton'

const BoardHeader = () => {
  return (
    <div className={styles.container}>
      <div style={{ width: '150px' }}>
        <TaskButton onClick={() => console.log('ok')} name={'...Pokaż mneu'} />
      </div>
    </div>
  )
}

export default BoardHeader