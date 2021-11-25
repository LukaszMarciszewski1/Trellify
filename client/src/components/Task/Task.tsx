import React, { useEffect, useState, useCallback, useRef } from 'react'
import styles from './styles.module.scss'
import TextareaAutosize from 'react-textarea-autosize';
import dayjs from 'dayjs';
import deleteIcon from '../../assets/icons/close.svg'
import editIcon from '../../assets/icons/mode.svg'
import doneIcon from '../../assets/icons/done.svg'
import dots from '../../assets/icons/dots.svg'
import showMoreBtn from '../../assets/icons/chevron-down.svg'
import showLessBtn from '../../assets/icons/chevron-up.svg'
import moveIcon from '../../assets/icons/move.svg'
import useOnClickOutside from '../../hooks/useOnClickOutside';
import IconButton from '../Details/IconButton/IconButton'

import {
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from "../../store/todosReducer/todosReducer";
interface Props {
  title: string
  description: string
  completed: number
  taskID?: any
  createdDate?: Date
  nowDate?: Date
}

const Task: React.FC<Props> = ({
  title,
  description,
  completed,
  taskID,
  createdDate,
  nowDate
}) => {
  const ref = useRef(null)
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const minRows = 2
  const maxRows = 20
  const maxLetters = 63
  const textareaLineHeight = 40;
  const taskCreateStatus = 0
  const taskInWorkStatus = 1
  const taskDoneStatus = 2

  const [todoTitle, setTodoTitle] = useState<string>(title);
  const [todoDescription, setTodoDescription] = useState<string>(description);
  const [disableEdit, setDisableEdit] = useState<boolean>(true)
  const [showEditActions, setShowEditActions] = useState<boolean>(false)
  const [rows, setRows] = useState<number>(minRows)

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
    setRows(e.target.scrollHeight / textareaLineHeight)
  }

  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
    e.preventDefault()
    updateTask({
      id: id,
      title: todoTitle,
      description: todoDescription
    })
    setDisableEdit(true)
    setRows(minRows)
  }

  const handleEditSettings = () => {
    setDisableEdit(false)
    setRows(maxRows)
    setShowEditActions(false)
  }

  const handleUpdateTask = () => updateTask({ id: taskID, completed: completed + 1, createdDate: nowDate })

  const handleClickOutside = () => {setShowEditActions(false)}
  useOnClickOutside(ref, handleClickOutside)

  return (
    <div className={styles.container} >
      <form>
        <div className={styles.header}>
          <TextareaAutosize
            className={`${styles.titleText} ${disableEdit === false ? styles.activeEdit : styles.titleText}`}
            disabled={disableEdit}
            value={disableEdit ? title : todoTitle}
            onChange={handleChangeValue}
            id='task-title'
          />
          <div className={styles.settings}>
            {
              showEditActions ? (
                <div className={styles.actions} ref={ref} >
                  {completed === taskCreateStatus ? (
                    <IconButton icon={moveIcon} onClick={handleUpdateTask} title={'do realizacji'} />
                  ) : completed === taskInWorkStatus ? (
                    <IconButton icon={doneIcon} onClick={handleUpdateTask} title={'zrobione'} />
                  ) : null}
                  {completed < 2 && <IconButton icon={editIcon} onClick={handleEditSettings} title={'edytuj'} />}
                  <IconButton icon={deleteIcon} onClick={() => deleteTask(taskID)} title={'usuń'} />
                </div>
              ) : null
            }
            <IconButton icon={dots} onClick={() => setShowEditActions(prev => !prev)} />
          </div>
        </div>
        <div className={styles.body}>
          <TextareaAutosize
            maxRows={rows}
            className={`${styles.bodyText} ${disableEdit === false ? styles.activeEdit : styles.bodyText}`}
            disabled={disableEdit}
            value={disableEdit ? description : todoDescription}
            onChange={handleChangeValue}
          />
          {
            todoDescription.length > maxLetters && rows === minRows ? (
              <IconButton icon={showMoreBtn} onClick={() => setRows(maxRows)} />
            ) : null
          }
          {
            rows === maxRows && disableEdit ? (
              <IconButton icon={showLessBtn} onClick={() => setRows(minRows)} />
            ) : null
          }
        </div>
        <div className={styles.dedline}>
          <p>{dayjs(createdDate).format('YYYY-MM-DDTHH:mm:ssZ')}</p>
          {disableEdit === false ?
            <button
              type='submit'
              onClick={(e) => handleSaveChanges(e, taskID)}
              className={styles.button}>
              zapisz
            </button>
            : null}
        </div>
      </form>
    </div>
  )
}

export default Task
