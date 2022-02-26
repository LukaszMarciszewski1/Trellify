import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import Button from '../../../../Details/Button/Button'
import { HexColorPicker } from "react-colorful";

type Props = {
  formId: string
  value: string | undefined
  handleSubmit: (value: any) => void
  handleChange: (value: any) => void
  onFocus?: (value: any) => void
  deleteLabel: () => void
  setSelectColor: (vlaue: string) => void
  selectColor: string
}

const LabelForm: React.FC<Props> = ({
  handleChange,
  handleSubmit,
  deleteLabel,
  value,
  formId,
  onFocus,
  setSelectColor,
  selectColor }) => {
  const placeholder = 'Dodaj nazwę etykiety...'

  return (
    <form className={styles.form}>
      <p style={{ marginBottom: '5px' }}>Nazwa</p>
      <TextareaAutosize
        id={formId}
        maxRows={20}
        placeholder={placeholder}
        value={value}
        className={styles.textarea}
        autoFocus
        onChange={handleChange}
        onFocus={onFocus}
      />
      <p style={{ marginBottom: '5px' }}>Wybierz kolor</p>
      <HexColorPicker className={styles.reactColorful} color={selectColor} onChange={setSelectColor} />
      <div className={styles.actionsForm}>
        <Button onClick={handleSubmit} title={'Zapisz'} />
        <div style={{ marginRight: '1rem' }} />
        <Button onClick={deleteLabel} title={'Usuń'} bgColor={'#EA4746'} />
      </div>
    </form>
  )
}

export default LabelForm