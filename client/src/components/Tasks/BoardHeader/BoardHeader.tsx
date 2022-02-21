import React from 'react'
import styles from './styles.module.scss'
import TaskButton from '../TaskButton/TaskButton'
import { BsImage } from "react-icons/bs";

type BoardHeaderProps = {
  icon?: any
  name: string
  onClick: () => void
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ icon, name, onClick }) => {
  return (
    <div className={styles.container}>
      <div style={{ width: '130px' }}>
        <TaskButton openForm={onClick} name={name} icon={<BsImage />} />
      </div>
    </div>
  )
}

export default BoardHeader