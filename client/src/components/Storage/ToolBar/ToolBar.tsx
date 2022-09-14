import React from 'react'
import styles from './styles.module.scss'
import Button from '../../Details/Button/Button'
import IconButton from '../../Details/IconButton/IconButton'
import TaskButton from '../../Details/TaskButton/TaskButton'
import Filters from './Filters/Filters'
import { GoPlus } from 'react-icons/go'

interface ToolBarProps {
  setIsModalOpen: (value: boolean) => void
}

const ToolBar: React.FC<ToolBarProps> = ({ setIsModalOpen }) => {
  return (
    <div className={styles.container}>
      <TaskButton
        icon={<GoPlus style={{ color: 'grey', fontSize: '1.2rem' }} />}
        name={'Dodaj produkt'}
        onClick={() => setIsModalOpen(true)}
        style={{ width: '200px' }}
      />
      <Filters />
    </div>
  )
}

export default ToolBar