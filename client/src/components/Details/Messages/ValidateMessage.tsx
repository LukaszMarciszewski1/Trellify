import React from 'react'
import styles from './styles.module.scss'

interface ValidateMessageProps {
  message: string
}

const ValidateMessage: React.FC<ValidateMessageProps> = ({ message }) => {
  return (
    <div className={styles.validateWrapper}>
      <span className={styles.validate}>{message}</span>
    </div>
  )
}

export default ValidateMessage