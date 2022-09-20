import React, { useState } from 'react'
import styles from './styles.module.scss'
import IconButton from '../../../Details/IconButton/IconButton';
import { Product } from '../../../../models/product';

import { BiDotsVerticalRounded } from 'react-icons/bi'
import Popup from '../../../Details/Popup/Popup';
import TaskButton from '../../../Details/TaskButton/TaskButton';

interface RowProps extends Product {
  action?: boolean
  onClick?: () => void
  deleteProd: () => void
  editProd: () => void
}

const Row: React.FC<RowProps> = ({ name, category, quantity, unit, price, action, editProd, deleteProd }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  return (
    <div className={action ? `${styles.row}` : `${styles.head}`}>
      <div className={`${styles.block} ${styles.r1}`}><p>{name}</p></div>
      <div className={`${styles.block} ${styles.r2}`}><p>{category}</p></div>
      <div className={`${styles.block} ${styles.r3}`}><p>{quantity}</p></div>
      <div className={`${styles.block} ${styles.r4}`}><p>{unit}</p></div>
      <div className={`${styles.block} ${styles.r5}`}><p>{price}</p></div>
      <div className={`${styles.block} ${styles.r6}`}>
        {action ? <IconButton onClick={() => setIsPopupOpen(true)}><BiDotsVerticalRounded style={{ fontSize: '1.2rem', color: 'grey' }} /></IconButton> : 'akcje'}
      </div>
      <Popup
        title={'Akcje listy'}
        trigger={isPopupOpen}
        closePopup={() => setIsPopupOpen(false)}
        top={'10px'}
        right={'10px'}
      >
        <div className={styles.popupContent}>
          <TaskButton
            onClick={editProd}
            name={'Etytuj'}
          />
          <TaskButton
            onClick={deleteProd}
            name={'Usuń'}
          />
        </div>
      </Popup>
    </div>
  )
}

export default Row