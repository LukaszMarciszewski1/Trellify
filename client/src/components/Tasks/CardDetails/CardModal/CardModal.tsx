import React from 'react'
import styles from './styles.module.scss'

const CardModal: React.FC = ({ children }) => {
  return (
    <div className={styles.overlay}>{children}</div>
  )
}

export default CardModal