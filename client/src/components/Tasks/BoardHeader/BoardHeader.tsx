import React from 'react'
import styles from './styles.module.scss'
import TaskButton from '../TaskButton/TaskButton'
import { IoLogoJavascript } from "react-icons/io";

type BoardHeaderProps = {
  icon?: any
  name: string
  onClick: () => void
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ icon, name, onClick }) => {
  return (
    <div className={styles.container}>
      <div style={{ width: '130px' }}>
        <TaskButton openForm={onClick} name={name} icon={icon} />
      </div>
    </div>
  )
}

export default BoardHeader