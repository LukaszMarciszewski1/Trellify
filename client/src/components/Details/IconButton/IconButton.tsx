import React from 'react'
import styles from './styles.module.scss'

interface IconButtonProps {
  onClick?: () => void
  icon?: any
  title?: string
  padding?: string
  style?: {}
}

const IconButton: React.FC<IconButtonProps> = (props) => (
  <button
    className={styles.iconButton}
    onClick={props.onClick}
    type='button'
    style={props.style}
  >
    {props.children}
  </button>
)

export default IconButton
