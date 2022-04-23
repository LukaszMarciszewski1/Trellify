import React, { useRef } from 'react'
import styles from './styles.module.scss'
import IconButton from '../IconButton/IconButton'
import { BsXLg } from "react-icons/bs";
import { MdOutlineArrowBackIos } from "react-icons/md";
import useOnClickOutside from '../../../hooks/useOnClickOutside'

type Props = {
  trigger?: boolean
  title: string
  closePopup: () => void
  editWindow?: boolean
  backToMainWindow?: () => void
}
const Popup: React.FC<Props> = ({ children, trigger, title, closePopup, editWindow, backToMainWindow }) => {
  const refPopup = useRef(null)
  useOnClickOutside(refPopup, closePopup)
  
  return (
    trigger ? (
      <div className={styles.popup} ref={refPopup}>
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