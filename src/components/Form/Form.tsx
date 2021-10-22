import React from 'react'
import styles from './styles.module.scss'
type Props = {
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  titleValue: string
  descriptionValue: string
}



const Form: React.FC<Props> = ({ handleChange, handleSubmit, titleValue, descriptionValue }) => {

  return (
    <form >
      <label htmlFor='task-title'>Tytół zadania</label>
      <input onChange={handleChange} type='text' value={titleValue} className={styles.input} id='task-title'></input>
      <label htmlFor='task-description'>Opis zadania zadania</label>
      <textarea onChange={handleChange} value={descriptionValue} className={styles.textarea} id='task-description'></textarea>
      <button type='submit' onClick={handleSubmit} className={styles.button}>dodaj</button>
    </form>
  )
}

export default Form
