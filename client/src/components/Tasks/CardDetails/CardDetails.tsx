import React, { useState, useRef } from 'react'
import styles from './styles.module.scss'

import TextareaAutosize from 'react-textarea-autosize';

import IconButton from '../../Details/IconButton/IconButton';
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { BsXLg } from 'react-icons/bs';

type Props = {
  title: string
  setOpenCardDetails: () => void
}

const CardDetails: React.FC<Props> = ({ title, setOpenCardDetails }) => {
  const ref = useRef(null)


  const handleCloseModal = () => { console.log('ok') }
  useOnClickOutside(ref, handleCloseModal)

  return (
    <div className={styles.overlay} onClick={setOpenCardDetails}>
      <div ref={ref} className={styles.container} >
        <div className={styles.cardHeader}>
          <TextareaAutosize
            id='list'
            autoFocus={true}
            value={title}
            className={styles.textarea}
            onChange={() => console.log('change title')}
            onFocus={(e) => e.target.select()}
            onBlur={() => console.log('close')}
            required
          />
          <IconButton onClick={setOpenCardDetails}><BsXLg /></IconButton>
        </div>
      </div>
    </div>

  )
}

export default CardDetails