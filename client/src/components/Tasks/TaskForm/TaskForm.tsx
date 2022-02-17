import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'

import Button from '../../Details/Button/Button'
import { BsXLg } from "react-icons/bs";
import IconButton from '../../Details/IconButton/IconButton';

type Props = {
  id: string
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  toggleState?: () => void
  onBlur?: () => void
  title: string
}

const TaskForm: React.FC<Props> = ({ handleChange, handleSubmit, toggleState, title, onBlur, id }) => {

  const placeholder = id === 'list' ? 'Dodaj listę zadań' : 'Dodaj nową kartę'

  return (
    <form className={styles.form}>
      <TextareaAutosize
        id={id}
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
