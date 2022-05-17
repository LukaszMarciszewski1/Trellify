import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss'
import Button from '../../../../../Details/Button/Button'
import { HexColorPicker } from "react-colorful";
import { presetColors } from '../../../../localData'
interface LabelProps {
  formId: string
  value: string | undefined
  selectColor: string
  handleChangeLabelTitle: (value: any) => void
  handleChangeTitle: (value: any) => void
  onFocus?: (value: any) => void
  handleDeleteLabel: () => void
  setSelectColor: (value: string) => void
}

const LabelForm: React.FC<LabelProps> = ({
  handleChangeTitle,
  handleChangeLabelTitle,
  handleDeleteLabel,
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
        onChange={handleChangeTitle}
        onFocus={onFocus}
      />
      <p style={{ marginBottom: '5px' }}>Wybierz kolor</p>
      <div className={styles.picker}>
        <HexColorPicker
          className={styles.reactColorful}
          color={selectColor}
          onChange={setSelectColor}
        />
        <div className={styles.pickerSwatches}>
          {presetColors.slice(0, 14).map((presetColor) => (
            <div
              key={presetColor}
              className={styles.pickerSwatch}
              style={{ background: presetColor }}
              onClick={() => setSelectColor(presetColor)}
            />
          ))}
        </div>
      </div>
      <div className={styles.actionsForm}>
        <Button onClick={handleChangeLabelTitle} title={'Zapisz'} type={'submit'} />
        <div style={{ marginRight: '1rem' }} />
        <Button onClick={handleDeleteLabel} title={'Usuń'} bgColor={'#EA4746'} type={'button'} />
      </div>
    </form>
  )
}

export default LabelForm