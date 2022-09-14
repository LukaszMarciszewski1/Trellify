import React, { useRef } from 'react'
import styles from './styles.module.scss'
import IconButton from '../IconButton/IconButton'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { BsXLg } from "react-icons/bs";

type ModalProps = {
  trigger: boolean
  closeModal: () => void
  children: JSX.Element | JSX.Element[];
}

const Modal: React.FC<ModalProps> = ({ children, trigger, closeModal }) => {
  const refModal = useRef(null)
  useOnClickOutside(refModal, closeModal)

  return (
    trigger ? (
      <div className={styles.overlay}>
        <div className={styles.modal} ref={refModal}>
          <div className={styles.header}>
            <IconButton onClick={closeModal}><BsXLg /></IconButton>
          </div>
          {children}
        </div>
      </div>
    ) : null
  )
}

export default Modal