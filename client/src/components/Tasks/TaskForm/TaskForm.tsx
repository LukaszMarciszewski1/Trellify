import React, { useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'

import Button from '../../Details/Button/Button'
import { BsXLg } from "react-icons/bs";
import IconButton from '../../Details/IconButton/IconButton';

type Props = {
  id: string
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  closeForm: () => void
  onFocus?: (value: any) => void
  onBlur?: () => void
  value: string
  titleBtn: string
}

const TaskForm: React.FC<Props> = ({ value, id, titleBtn, onBlur, onFocus, handleChange, handleSubmit, closeForm }) => {
  const placeholder = id === 'list' ? 'Dodaj listę zadań' : 'Dodaj nową kartę'

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.code === "NumpadEnter") {
      e.stopPropagation();
      handleSubmit(e)
    }
  }

  return (
    <form className={styles.form} >
      <TextareaAutosize
        id={id}
        maxRows={20}
        placeholder={placeholder}
        value={value}
        className={styles.textarea}
        autoFocus={true}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        required
      />
      <div className={styles.actionsForm}>
        <Button title={titleBtn} type={'submit'} onClick={handleSubmit} />
        <div style={{ marginRight: '16px' }} />
        <IconButton onClick={closeForm}><BsXLg /></IconButton>
      </div>
    </form>
  )
}

export default TaskForm
