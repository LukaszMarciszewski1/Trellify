import React, { useRef } from 'react'
import styles from './styles.module.scss'
import IconButton from '../IconButton/IconButton'
import { BsXLg } from "react-icons/bs";
import { MdOutlineArrowBackIos } from "react-icons/md";
import useOnClickOutside from 'hooks/useOnClickOutside'

interface PopupPosition {
 right?: string,
 top?: string
}

interface PopupProps extends PopupPosition {
  trigger?: boolean
  title: string
  isEditWindow?: boolean
  closePopup: () => void
  backToMainWindow?: () => void
}
const Popup: React.FC<PopupProps> = ({ children, trigger, title, isEditWindow, closePopup, backToMainWindow, ...props}) => {
  const refPopup = useRef(null)
  useOnClickOutside(refPopup, closePopup)
  
  return (
    trigger ? (
      <div className={styles.popup} ref={refPopup} style={{...props}}>
        <div className={styles.header}>
          {isEditWindow ? <IconButton onClick={backToMainWindow}><MdOutlineArrowBackIos /></IconButton> : null}
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