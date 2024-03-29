import React from 'react'
import styles from './styles.module.scss'
import { BiErrorCircle } from 'react-icons/bi'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.error}><BiErrorCircle /> {message}</span>
    </div>
  )
}

export default ErrorMessage