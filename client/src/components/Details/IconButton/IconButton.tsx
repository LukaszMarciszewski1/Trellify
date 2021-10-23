import React from 'react'
import styles from './styles.module.scss'

interface IconButtonProps {
  onClick: () => void;
  icon: string
}

const IconButton:React.FC<IconButtonProps> = (props) => (
  <button
   className={styles.iconButton}
   onClick={props.onClick}
   style={{backgroundImage: `url(${props.icon})`, width: '1.rem', height: '1.5rem'}}
   type='button'
  />
)
    
export default IconButton
