import React from 'react'
import styles from './styles.module.scss'
import { BiCheck } from 'react-icons/bi'
import { BsPencil } from 'react-icons/bs'
import IconButton from 'components/Details/IconButton/IconButton'

interface LabelProps {
  labelId: string
  title: string
  color: string
  cardLabels: {
    _id: string
    active: boolean
    color: string
    title: string
  }[]
  handleCheckedLabel: (value: any) => void
  openLabelEditWindow: () => void
}

const Label: React.FC<LabelProps> = ({ title, color, cardLabels, handleCheckedLabel, openLabelEditWindow, labelId }) => {
  const activeLabels = cardLabels.filter((label: { _id: string }) => label._id === labelId)
  return (
    <div className={styles.container}>
      <div onClick={handleCheckedLabel} style={{ background: `${color}` }} className={styles.boxColor}>
        <p>{title}</p>
        {activeLabels.length ? < BiCheck style={{ color: 'white' }} /> : null}
      </div>
      <IconButton onClick={openLabelEditWindow}><BsPencil /></IconButton>
    </div>
  )
}

export default Label