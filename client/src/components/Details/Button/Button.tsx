import React from 'react'
import styles from './styles.module.scss'

interface ButtonProps {
  onClick?: (e: any) => void
  style?: {}
  title: string
  icon?: Element
  type?: "button" | "submit" | "reset" | undefined
  disabled?: boolean
  version?: string
}

const Button: React.FC<ButtonProps> = ({ title, style, disabled, type, onClick, ...props }) => (
  <button
    className={`${styles.button} ${type === "reset" && styles.reset}`}
    style={style}
    onClick={onClick}
    disabled={disabled}
    {...props}>
    {title}
  </button>
)

export default Button
