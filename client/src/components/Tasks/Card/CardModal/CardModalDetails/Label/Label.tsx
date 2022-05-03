import React from 'react'
import styles from './styles.module.scss'
import { BiCheck } from 'react-icons/bi';
import IconButton from '../../../../../Details/IconButton/IconButton'
import { BsPencil } from 'react-icons/bs';
import LabelForm from '../LabelForm/LabelForm';

type Props = {
  labelId: string
  title: string
  color: string
  cardLabels: {
    active: any
    color: any
    _id: string
    title: string
  }[]
  checkedLabel: (value: any) => void
  openLabelEditWindow: () => void
}

const Label: React.FC<Props> = ({ title, color, cardLabels, checkedLabel, openLabelEditWindow, labelId }) => {
  const activeLabels = cardLabels.filter((label: { _id: string }) => label._id === labelId)
  return (
    <div className={styles.container}>
      <div onClick={checkedLabel} style={{ background: `${color}` }} className={styles.boxColor}>
        <p>{title}</p>
        {activeLabels.length ? < BiCheck style={{ color: 'white' }} /> : null}
      </div>
      <IconButton onClick={openLabelEditWindow}><BsPencil /></IconButton>
    </div>
  )
}

export default Label