import React from 'react'
import styles from './styles.module.scss'
interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.span}>{message}</span>
    </div>
  )
}

export default ErrorMessage