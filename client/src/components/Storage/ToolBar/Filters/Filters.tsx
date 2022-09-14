import React from 'react'
import styles from './styles.module.scss'
import { FaFilter } from 'react-icons/fa'
import IconButton from '../../../Details/IconButton/IconButton'
import TaskButton from '../../../Details/TaskButton/TaskButton'

const Filters = () => {
  return (
    <div className={styles.container}>
      <TaskButton
        icon={<FaFilter style={{ color: 'grey', fontSize: '1.2rem' }}/>}
        name={'Filtruj'}
        onClick={() => console.log('ok')}
        style={{ width: 'auto' }}
      />
    </div>
  )
}

export default Filters