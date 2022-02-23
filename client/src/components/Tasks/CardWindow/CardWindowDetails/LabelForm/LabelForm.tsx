import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import Button from '../../../../Details/Button/Button'

import { BlockPicker } from 'react-color';
import { HexColorPicker } from "react-colorful";

type Props = {
  id: string
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  onFocus?: (value: any) => void
  deleteLabel: () => void
  onBlur?: () => void
  value: string | undefined
  currentLabelColor: string
}

const LabelForm: React.FC<Props> = ({ handleChange, handleSubmit, deleteLabel, value, id, onBlur, onFocus, currentLabelColor }) => {
  const [activeColor, setActiveColor] = useState(currentLabelColor)
  const placeholder = 'Dodaj nazwę etykiety...'

  return (
    <form className={styles.form}>
      <p style={{ marginBottom: '5px' }}>Nazwa</p>
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
        required />
      <p style={{ marginBottom: '5px' }}>Wybierz kolor</p>
      <HexColorPicker className={styles.reactColorful} color={activeColor} onChange={setActiveColor} />
      <div className={styles.actionsForm}>
        <Button onClick={handleSubmit} title={'Zapisz'} />
        <div style={{ marginRight: '1rem' }} />
        <Button onClick={deleteLabel} title={'Usuń'} bgColor={'#EA4746'} />
      </div>
    </form>
  )
}

export default LabelForm