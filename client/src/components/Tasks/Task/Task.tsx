import React, { useEffect, useState, useCallback, useRef } from 'react'
import styles from './styles.module.scss'
import TextareaAutosize from 'react-textarea-autosize';
import dayjs from 'dayjs';
import { nowDate } from '../../../hooks/nowDate';
import deleteIcon from '../../../assets/icons/close.svg'
import editIcon from '../../../assets/icons/mode.svg'
import doneIcon from '../../../assets/icons/done.svg'
import dots from '../../../assets/icons/dots.svg'
import showMoreBtn from '../../../assets/icons/chevron-down.svg'
import showLessBtn from '../../../assets/icons/chevron-up.svg'
import moveIcon from '../../../assets/icons/move.svg'
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import Button from '../../Details/Button/Button'
import IconButton from '../../Details/IconButton/IconButton'

import {
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from "../../../store/reducers/listsReducer";
interface TaskProps {
  title: string
  description: string
  completed: number
  deadline: string
  taskID: string
  createdDate?: Date
  // nowDate?: Date
}

const SAVE_LABEL = 'zapisz'

const Task: React.FC = () => {
  // const ref = useRef(null)
  // const [updateTask] = useUpdateTaskMutation()
  // const [deleteTask] = useDeleteTaskMutation()
  // const minRows = 2
  // const maxRows = 20
  // const maxLetters = 63
  // const textareaLineHeight = 40;
  // const taskCreateStatus = 0
  // const taskInWorkStatus = 1
  // const taskDoneStatus = 2

  // const [todoTitle, setTodoTitle] = useState<string>(title);
  // const [todoDescription, setTodoDescription] = useState<string>(description);
  // const [editDeadline, setEditDeadline] = useState<string>(deadline)
  // const [disableEdit, setDisableEdit] = useState<boolean>(true)
  // const [showEditActions, setShowEditActions] = useState<boolean>(false)
  // const [rowsTextarea, setRowsTextarea] = useState<number>(minRows)

  // const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   if(e.target.id === 'task-title') setTodoTitle(e.target.value)
  //   if(e.target.id === 'task-description') setTodoDescription(e.target.value)
  //   if(e.target.id === 'task-deadline') setEditDeadline(e.target.value)
  //   setRowsTextarea(maxRows)
  // }

  // const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): void => {
  //   e.preventDefault()
  //   if(todoTitle.length > 0 && todoDescription.length > 0){
  //     updateTask({
  //       id: id,
  //       title: todoTitle,
  //       description: todoDescription,
  //       deadline: editDeadline
  //     })
  //     setDisableEdit(true)
  //     setRowsTextarea(minRows)
  //   }
  //   else alert('uzupełnij pole')
  // }

  // const handleOpenEdit = (): void => {
  //   setDisableEdit(false)
  //   setRowsTextarea(maxRows)
  //   setShowEditActions(false)
  // }

  // const handleCloseEdit = (): void => {
  //   setDisableEdit(true);
  //   setRowsTextarea(minRows)
  //   setTodoDescription(description)
  // }

  // const handleUpdateTask = () => updateTask({ id: taskID, completed: completed + 1, createdDate: nowDate() })

  // const handleClickOutside = () => setShowEditActions(false)
  // useOnClickOutside(ref, handleClickOutside)

  return (
    <div className={styles.container} >
      {/* <form>
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
                  {completed < 2 && <IconButton icon={editIcon} onClick={handleOpenEdit} title={'edytuj'} />}
                  <IconButton icon={deleteIcon} onClick={() => deleteTask(taskID)} title={'usuń'} />
                </div>
              ) : null
            }
            <IconButton icon={dots} onClick={() => setShowEditActions(prev => !prev)} />
          </div>
        </div>
        <div className={styles.body}>
          <TextareaAutosize
            maxRows={rowsTextarea}
            id='task-description'
            className={`${styles.bodyText} ${disableEdit === false ? styles.activeEdit : styles.bodyText}`}
            disabled={disableEdit}
            value={disableEdit ? description : todoDescription}
            onChange={handleChangeValue}
          />
          {
            todoDescription.length > maxLetters && rowsTextarea === minRows ? (
              <IconButton icon={showMoreBtn} onClick={() => setRowsTextarea(maxRows)} />
            ) : null
          }
          {
            rowsTextarea === maxRows && disableEdit ? (
              <IconButton icon={showLessBtn} onClick={() => setRowsTextarea(minRows)} />
            ) : null
          }
        </div>
        <div className={styles.bottomBar}>
          <div className={styles.dedlineBar}>
            <p>deadline</p>
            {
              disableEdit ? 
              <p>{deadline}</p> : 
            <input onChange={handleChangeValue} type="date" id="task-deadline" value={disableEdit ? deadline : editDeadline} className={styles.deedline} />
            }
            
          </div>
          {disableEdit === false ?
            <div className={styles.editActions}>
              <Button
                onClick={(e) => handleSaveChanges(e, taskID)}
                title={SAVE_LABEL}
              />
              <IconButton icon={deleteIcon} onClick={handleCloseEdit} />
            </div>
            : null}
        </div>
      </form> */}
    </div>
  )
}

export default Task
