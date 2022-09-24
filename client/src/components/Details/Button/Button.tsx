import React from 'react'
import styles from './styles.module.scss'

interface ButtonProps {
  onClick?: (e: any) => void
  style?: {}
  title: string
  icon?: Element
  type?: "button" | "submit" | "reset" | undefined
}

const Button: React.FC<ButtonProps> = ({ title, style, onClick, ...props }) => (
  <button
    className={styles.button}
    style={style}
    onClick={onClick}
    {...props}>
    {title}
  </button>
)

export default Button
