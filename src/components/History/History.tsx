import React from 'react'
import styles from './styles.module.scss'
import {historyTasks} from '../../data'

const History:React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.task}>
        <h3>Task 1</h3>
        <p>The standard chunk of Lorem Ipsum used 
          since the 1500s is reproduced below for those interested. 
          Sections 1.10.32 and 1.10.33
        </p>
        <button>zobacz więcej</button>
      </div>
      <div className={styles.task}>
        <h3>Task 1</h3>
        <p>The standard chunk of Lorem Ipsum used 
          since the 1500s is reproduced below for those interested. 
          Sections 1.10.32 and 1.10.33
        </p>
        <button>zobacz więcej</button>
      </div>
      <div className={styles.task}>
        <h3>Task 1</h3>
        <p>The standard chunk of Lorem Ipsum used 
          since the 1500s is reproduced below for those interested. 
          Sections 1.10.32 and 1.10.33
        </p>
        <button>zobacz więcej</button>
      </div>
    </div>
  )
}

export default History
