import React from 'react'
import styles from './styles.module.scss'

interface IconButtonProps {
  onClick?: () => void
  style?: {}
  children: JSX.Element
}

const IconButton: React.FC<IconButtonProps> = ({ style, onClick, children }) => (
  <button
    className={styles.iconButton}
    onClick={onClick}
    type='button'
    style={style}
  >
    {children}
  </button>
)

export default IconButton
