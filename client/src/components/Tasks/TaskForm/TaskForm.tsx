import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'

import Button from '../../Details/Button/Button'

type Props = {
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  titleValue: string
  placeholder:string
}

const TaskForm: React.FC<Props> = ({ handleChange, handleSubmit, titleValue, placeholder }) => {
  return (
      <form className={styles.form}>
        <TextareaAutosize 
        placeholder={placeholder}
        maxRows={3} 
        onChange={handleChange} 
        value={titleValue} 
        className={styles.textarea} 
        id='task-title' 
        required/>
        <Button onClick={handleSubmit} title={'Dodaj'}/>
      </form>
  )
}

export default TaskForm
