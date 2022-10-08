import React from 'react'
import styles from './styles.module.scss'
import { Labels as LabelModel } from 'models/labels'
import { BiCheck } from 'react-icons/bi'
import { BsPencil } from 'react-icons/bs'
import IconButton from 'components/common/IconButton/IconButton'

interface LabelProps {
  labelId: string
  title: string
  color: string
  cardLabels: LabelModel[]
  handleCheckedLabel: () => void
  openLabelEditWindow: () => void
}

const Label: React.FC<LabelProps> = ({
  labelId,
  title,
  color,
  cardLabels,
  handleCheckedLabel,
  openLabelEditWindow,
}) => {

  const activeLabels = cardLabels.filter((label: { _id: string }) => label._id === labelId)
  return (
    <div className={styles.label}>
      <div
        onClick={handleCheckedLabel}
        style={{ background: `${color}` }}
        className={styles.boxColor}>
        <p>{title}</p>
        {activeLabels.length ? < BiCheck style={{ color: 'white' }} /> : null}
      </div>
      <IconButton onClick={openLabelEditWindow}><BsPencil /></IconButton>
    </div>
  )
}

export default Label