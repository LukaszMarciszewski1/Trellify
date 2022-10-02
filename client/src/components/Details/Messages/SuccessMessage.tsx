import React from 'react'
import styles from './styles.module.scss'
import { GiCheckMark } from 'react-icons/gi'

interface SuccessMessageProps {
  message: string
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.success}><GiCheckMark /> {message}</span>
    </div>
  )
}

export default SuccessMessage