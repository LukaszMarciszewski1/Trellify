import React from 'react'
import styles from './styles.module.scss'

interface ButtonProps {
  onClick?: (e: any) => void
  title?: string
  bgColor?: string
  icon?: Element
  type: "button" | "submit" | "reset" | undefined
}

const Button: React.FC<ButtonProps> = ({ title, ...props }) => (
  <button
    className={styles.button}
    {...props}>
    {title}
  </button>
)

// const Button: React.FC<ButtonProps> = ({ onClick, bgColor, title, type }) => (
//   <button
//     className={styles.button}
//     onClick={onClick}
//     type={type}
//     style={{ backgroundColor: `${bgColor}` }}>
//     {title}
//   </button>
// )

export default Button
