import React, { useEffect, useState, useCallback, useRef } from 'react'
import  TextareaAutosize  from  'react-textarea-autosize' ;
import styles from './styles.module.scss'

import IconButton from '../Details/IconButton/IconButton'

import deleteIcon from '../../assets/icons/close.svg'
import editIcon from '../../assets/icons/mode.svg'
import doneIcon from '../../assets/icons/done.svg'
import dots from '../../assets/icons/dots.svg'
import showMoreBtn from '../../assets/icons/chevron-down.svg'
import showLessBtn from '../../assets/icons/chevron-up.svg'

import useOnClickOutside from '../../hooks/useOnClickOutside';

import {
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from "../../store/todosReducer/todosReducer";
interface Props {
  title: string
  description: string
  completed: number
  handleRemove?: any
  handleChangeStatus?: any
  taskID?: any
}

const Task: React.FC<Props> = ({
  title,
  description,
  completed,
  handleRemove,
  handleChangeStatus,
  taskID
}) => {
  const ref = useRef(null)
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const minRows = 2
  const maxRows = 10
  const maxLetters = 63
  const textareaLineHeight = 30;

  const [todoTitle, setTodoTitle] = useState<string>(title);
  const [todoDescription, setTodoDescription] = useState<string>(description);
  const [disable, setDisable] = useState<boolean>(true)
  const [showEditActions, setShowEditActions] = useState<boolean>(false)
  const [showMoreTxt, setShowMoreTxt] = useState(minRows)
  const [rows, setRows] = useState(minRows)
console.log(showEditActions)
    const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
      setShowMoreTxt(e.target.scrollHeight / textareaLineHeight) 
  }

  const submitSaveEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
    e.preventDefault()
    updateTask({
      id: id,
      title: todoTitle,
      description: todoDescription
    })
    setDisable(true)
    setRows(minRows)
  }

  const editSettings = () => {
    setDisable(prev => !prev)
    setRows(maxRows)
  }

  const handleClickOutside = () => setShowEditActions(false)
  useOnClickOutside(ref, handleClickOutside)

  return (
    <div className={styles.container} >
      <form>
        <div className={styles.header}>
          <TextareaAutosize
            className={`${styles.titleText} ${disable === false ? styles.activeEdit : styles.titleText}`}
            disabled={disable}
            value={disable ? title : todoTitle}
            onChange={handleChangeValue}
            id='task-title'
          />
          <div className={styles.settings}>
          {
            showEditActions ? (
              <div className={styles.actions} ref={ref} >
                {completed <= 1 && <IconButton padding={'.5rem'} icon={doneIcon} onClick={() => updateTask({ id: taskID, completed: completed === 0 ? + 1 : + 2 })} title={'do realizacji'}/>}
                {completed < 2 && <IconButton padding={'.5rem'} icon={editIcon} onClick={editSettings} title={'edytuj'}/>}
                <IconButton padding={'.5rem'} icon={deleteIcon} onClick={() => deleteTask(taskID)} title={'usuń'}/>
              </div>
            ) : null
          }
          <IconButton icon={dots} onClick={() => setShowEditActions(prev => !prev)} title={'ustawienia'}/>
          </div>
          
        </div>
        <div className={styles.body}>
          <TextareaAutosize
            maxRows={rows}
            className={`${styles.bodyText} ${disable === false ? styles.activeEdit : styles.bodyText}`}
            disabled={disable}
            value={disable ? description : todoDescription}
            onChange={handleChangeValue}
          />
          {
           todoDescription.length > maxLetters && rows === minRows ? (
             <IconButton icon={showMoreBtn} onClick={() => setRows(maxRows)} title={'ustawienia'}/>
           ) : null
          }
          {
            rows === maxRows && disable ? (
             <IconButton icon={showLessBtn} onClick={() => setRows(minRows)} title={'ustawienia'}/>
           ) : null
          }
        </div>
        <div className={styles.dedline}>
          <p>dedline: 15.10.2022</p>
          {disable === false ?
            <button
              type='submit'
              onClick={(e) => submitSaveEdit(e, taskID)}
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
