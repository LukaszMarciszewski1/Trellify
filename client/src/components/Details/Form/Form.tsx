import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
type Props = {
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  titleValue: string
  descriptionValue: string
  deadline: string
}

const Form: React.FC<Props> = ({ handleChange, handleSubmit, titleValue, descriptionValue, deadline }) => {

  return (
    <form className={styles.form}>
      {/* <label htmlFor='task-title'>Tytół zadania</label>
      <TextareaAutosize maxRows={3} onChange={handleChange} value={titleValue} className={styles.textareaTitle} id='task-title' required/>
      <label htmlFor='task-description'>Opis zadania zadania</label>
      <TextareaAutosize onChange={handleChange} value={descriptionValue} className={styles.textareaBody} id='task-description' required/>
      <label htmlFor='task-deadline'>Deadline</label>
      <input onChange={handleChange} type="date" id="task-deadline" value={deadline} className={styles.deadline} />
      <button type='submit' onClick={handleSubmit} className={styles.button}>dodaj</button> */}
    </form>
  )
}

export default Form
