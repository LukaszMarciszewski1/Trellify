import React from 'react'
import styles from './styles.module.scss'
import IconButton from '../IconButton/IconButton'
import { BsXLg } from "react-icons/bs";
import { MdOutlineArrowBackIos } from "react-icons/md";

type Props = {
  trigger: boolean
  title: string
  closePopup: () => void
  editWindow?: boolean
  backToMainWindow?: () => void
}

const Popup: React.FC<Props> = ({ children, trigger, title, closePopup, editWindow, backToMainWindow }) => {
  return (
    trigger ? (
      <div className={styles.popup}>
        <div className={styles.menuHeader}>
          {editWindow ? <IconButton onClick={backToMainWindow}><MdOutlineArrowBackIos /></IconButton> : null}
          <h3>{title}</h3>
          <IconButton onClick={closePopup}><BsXLg /></IconButton>
        </div>
        <div className={styles.popupContent}>
          {children}
        </div>
      </div>
    ) : null
  )
}

export default Popup