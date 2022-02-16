import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'

import Button from '../../Details/Button/Button'
import { BsXLg } from "react-icons/bs";
import IconButton from '../../Details/IconButton/IconButton';

type Props = {
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  toggleState?: () => void
  onBlur?: () => void
  title: string
  placeholder: string
}

const TaskForm: React.FC<Props> = ({ handleChange, handleSubmit, toggleState, title, placeholder, onBlur }) => {
  return (
    <form className={styles.form}>
      <TextareaAutosize
        id='task-title'
        maxRows={3}
        placeholder={placeholder}
        value={title}
        className={styles.textarea}
        autoFocus
        onChange={handleChange}
        onBlur={onBlur}
        required />
      <div className={styles.actions}>
        <Button onClick={handleSubmit} title={'Dodaj'} />
        <div style={{ marginRight: '1rem' }} />
        <IconButton onClick={toggleState}><BsXLg /></IconButton>
      </div>
    </form>
  )
}

export default TaskForm
