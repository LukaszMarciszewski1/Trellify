import React from 'react'
import styles from './styles.module.scss'

import IconButton from '../Details/IconButton/IconButton'

import deleteIcon from '../../assets/icons/close.svg'
import editIcon from '../../assets/icons/mode.svg'
import doneIcon from '../../assets/icons/done.svg'

interface Props {
  title: string,
  description: string,
  completed: number
  handleRemove?: any
  handleChangeStatus?: any
  handleUpdate?: any
}

const Task: React.FC<Props> = ({
  title,
  description,
  completed,
  handleRemove,
  handleChangeStatus,
  handleUpdate,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <div className={styles.actions}>
          {!completed && <IconButton icon={doneIcon} onClick={handleChangeStatus} />}
          {!completed && <IconButton icon={editIcon} onClick={handleUpdate} />}
          <IconButton icon={deleteIcon} onClick={handleRemove} />
        </div>
      </div>
      <div className={styles.content}>
        <p>{description}</p>
      </div>
      <div className={styles.dedline}>
        <p>dedline: 15.10.2022</p>
      </div>
    </div>
  )
}

export default Task
