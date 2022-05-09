import React, { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'

import Button from '../../Details/Button/Button'
import { BsXLg } from "react-icons/bs";
import IconButton from '../../Details/IconButton/IconButton';

type Props = {
  id: string
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  onFocus?: (value: any) => void
  closeForm: () => void
  onBlur?: () => void
  value: string | undefined
  titleBtn: string
}

const TaskForm: React.FC<Props> = ({ handleChange, handleSubmit, closeForm, value, id, onBlur, onFocus, titleBtn }) => {
  const placeholder = id === 'list' ? 'Dodaj listę zadań' : 'Dodaj nową kartę'

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.code === "NumpadEnter") {
      e.stopPropagation();
      handleSubmit(e)
  }
}

  return (
    <form className={styles.form}>
      <TextareaAutosize
        id={id}
        maxRows={20}
        placeholder={placeholder}
        value={value}
        className={styles.textarea}
        autoFocus
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        required />
      <div className={styles.actionsForm}>
        <Button onClick={handleSubmit} title={titleBtn} type={'submit'} />
        <div style={{ marginRight: '1rem' }} />
        <IconButton onClick={closeForm}><BsXLg /></IconButton>
      </div>
    </form>
  )
}

export default TaskForm
