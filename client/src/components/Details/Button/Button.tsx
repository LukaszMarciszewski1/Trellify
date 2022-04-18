import React from 'react'
import styles from './styles.module.scss'

interface ButtonProps {
  onClick?: (e: any) => void
  title?: string
  bgColor?: string
  type: any
}

const Button: React.FC<ButtonProps> = ({onClick, bgColor, title, type}) => (
  <button
    className={styles.button}
    onClick={onClick} 
    type={type}
    style={{ backgroundColor: `${bgColor}`}}>
    {title}
  </button>
)

export default Button
