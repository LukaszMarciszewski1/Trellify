import React from 'react'
import styles from './styles.module.scss'
import TaskButton from '../TaskButton/TaskButton'
import { BsImage } from "react-icons/bs";

type BoardHeaderProps = {
  name: string
  onClick: () => void
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ name, onClick }) => {
  return (
    <div className={styles.container}>
      <div style={{ width: '130px' }}>
        <TaskButton onClick={onClick} name={name} icon={<BsImage />} />
      </div>
    </div>
  )
}

export default BoardHeader