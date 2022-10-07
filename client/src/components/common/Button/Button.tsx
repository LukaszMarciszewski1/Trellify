import React from 'react'
import styles from './styles.module.scss'

interface ButtonProps {
  title: string
  onClick?: (e: any) => void
  style?: {}
  icon?: Element
  type: "button" | "submit" | "reset" | undefined
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  title,
  style,
  disabled,
  type,
  onClick,
}) => (
  <button
    className={`${styles.button} ${type === "reset" && styles.reset}`}
    style={style}
    onClick={onClick}
    disabled={disabled}
  >
    {title}
  </button>
)

export default Button
