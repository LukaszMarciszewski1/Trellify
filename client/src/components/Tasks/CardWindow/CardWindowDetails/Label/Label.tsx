import React from 'react'
import styles from './styles.module.scss'
import { BiCheck } from 'react-icons/bi';
import IconButton from '../../../../Details/IconButton/IconButton'
import { BsPencil } from 'react-icons/bs';
import LabelForm from '../LabelForm/LabelForm';

type Props = {
  title: string
  color: string
  active: boolean
  checkedLabel: (value: any) => void
  openLabelEditWindow: () => void
}

const Label: React.FC<Props> = ({ title, color, active, checkedLabel, openLabelEditWindow }) => {
  return (
    <div className={styles.container}>
      <div onClick={checkedLabel} style={{ background: `${color}` }} className={styles.boxColor}>
        <p>{title}</p>
        {active ? < BiCheck style={{ color: 'white' }} /> : null}
      </div>
      <IconButton onClick={openLabelEditWindow}><BsPencil /></IconButton>
    </div>
  )
}

export default Label