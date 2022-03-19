import React from 'react'
import styles from './styles.module.scss'

interface ButtonProps {
  onClick?: (e: any) => void
  title?: string
  bgColor?: string
}

const Button: React.FC<ButtonProps> = (props) => (
  <button
    className={styles.button}
    onClick={props.onClick} type='button'
    style={{ backgroundColor: `${props.bgColor}`}}>
    {props.title}
  </button>
)

export default Button
