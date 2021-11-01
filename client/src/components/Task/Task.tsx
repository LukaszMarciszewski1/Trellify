import React, { useEffect, useState, useCallback } from 'react'
import styles from './styles.module.scss'

import IconButton from '../Details/IconButton/IconButton'

import deleteIcon from '../../assets/icons/close.svg'
import editIcon from '../../assets/icons/mode.svg'
import doneIcon from '../../assets/icons/done.svg'

interface Props {
  title: string
  description: string
  completed: number
  handleRemove?: any
  handleChangeStatus?: any
  handleOpenEdit?: any
  disabled?: boolean
  onChangeTask?: (value: any) => void
  saveEdit?:(value: any) => void
}

const Task: React.FC<Props> = ({
  title,
  description,
  completed,
  handleRemove,
  handleChangeStatus,
  handleOpenEdit,
  onChangeTask,
  disabled,
  saveEdit
}) => {
  const [state, setState] = useState(true)
  return (
    <div className={styles.container}>
      <form>
        <div className={styles.header}>
          <textarea
            className={`${styles.titleText} ${disabled === false ? styles.activeEdit : styles.titleText}`}
            disabled={disabled}
            value={title}
            onChange={onChangeTask}
            id='task-title'
          />
          <div className={styles.actions}>
            {!completed && <IconButton icon={doneIcon} onClick={handleChangeStatus} />}
            {!completed && <IconButton icon={editIcon} onClick={handleOpenEdit} />}
            <IconButton icon={deleteIcon} onClick={handleRemove} />
          </div>
        </div>
        <div className={styles.content}>
          {/* <p className={styles.bodyText} >{description}</p> */}
          <textarea
            className={`${styles.bodyText} ${disabled === false ? styles.activeEdit : styles.bodyText}`}
            disabled={disabled}
            value={description}
            onChange={onChangeTask}
          ></textarea>
        </div>
        <div className={styles.dedline}>
          <p>dedline: 15.10.2022</p>
          {disabled === false ? <button type='submit' onClick={saveEdit} className={styles.button}>zapisz</button> : null}
        </div>
      </form>
    </div>
  )
}

export default Task
