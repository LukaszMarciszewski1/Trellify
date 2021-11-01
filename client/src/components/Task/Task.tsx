import React, { useEffect, useState, useCallback, useRef } from 'react'
import styles from './styles.module.scss'

import IconButton from '../Details/IconButton/IconButton'

import deleteIcon from '../../assets/icons/close.svg'
import editIcon from '../../assets/icons/mode.svg'
import doneIcon from '../../assets/icons/done.svg'
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

  const [todoTitle, setTodoTitle] = useState<string>(title);
  const [todoDescription, setTodoDescription] = useState<string>(description);
  const [disable, setDisable] = useState<boolean>(true)

  // useEffect(() => {
  //   setActive(true)
  // }, [title, description]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.id === 'task-title' ? setTodoTitle(e.target.value) : setTodoDescription(e.target.value)
  }

  const submitSaveEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
    e.preventDefault()
    updateTask({
      id: id,
      title: todoTitle,
      description: todoDescription
    })
    setDisable(true)
  }

  const handleClickOutside = () => setDisable(true)
  useOnClickOutside(ref, handleClickOutside)

  return (
    <div className={styles.container} ref={ref} >
      <form>
        <div className={styles.header}>
          <textarea
            className={`${styles.titleText} ${disable === false ? styles.activeEdit : styles.titleText}`}
            disabled={disable}
            value={disable ? title : todoTitle}
            onChange={handleChangeValue}
            id='task-title'
          />
          <div className={styles.actions}>
            {!completed && <IconButton icon={doneIcon} onClick={() => updateTask({ id: taskID, completed: completed + 1 })} />}
            {!completed && <IconButton icon={editIcon} onClick={() => setDisable(prev => !prev)} />}
            <IconButton icon={deleteIcon} onClick={()=>deleteTask(taskID)} />
          </div>
        </div>
        <div className={styles.content}>
          <textarea
            className={`${styles.bodyText} ${disable === false ? styles.activeEdit : styles.bodyText}`}
            disabled={disable}
            value={disable ? description : todoDescription}
            onChange={handleChangeValue}
          ></textarea>
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
