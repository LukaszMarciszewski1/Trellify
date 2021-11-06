import React from 'react'
import styles from './styles.module.scss'

interface IconButtonProps {
  onClick?: () => void;
  icon: string,
  title: string,
  padding?: string
}

const IconButton: React.FC<IconButtonProps> = (props) => (
  <button
    className={styles.iconButton}
    onClick={props.onClick}
    style={{ padding: props.padding }}
    type='button'
    title={props.title}
  ><img src={props.icon}/></button>
)

export default IconButton
