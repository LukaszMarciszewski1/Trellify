import React from 'react'
import styles from './styles.module.scss'
import IconButton from '../IconButton/IconButton'
import { BsXLg } from "react-icons/bs";

type Props = {
  trigger: boolean
  title: string
  colosePopup: () => void
}

const Popup: React.FC<Props> = ({ children, trigger, title,  colosePopup}) => {
  return (
    trigger ? (
      <div className={styles.popup}>
        <div className={styles.menuHeader}>
          <h3>{title}</h3>
          <IconButton onClick={colosePopup}><BsXLg /></IconButton>
        </div>
        <div className={styles.popupContent}>
          {children}
        </div>
      </div>
    ) : null
  )
}

export default Popup