import React from 'react'
import styles from './styles.module.scss'

interface CardProps {
  onClick?: () => void
  // children: JSX.Element | JSX.Element[];
}

const Card: React.FC<CardProps> = ({ onClick, children }) => {
  return (
    <div className={styles.box}>
      <div className={styles.container} >
        <div className={styles.clickableArea} onClick={onClick}></div>
        {children}
      </div>
    </div>
  )
}

export default Card