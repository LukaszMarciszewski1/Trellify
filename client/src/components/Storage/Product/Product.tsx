import React, { useState } from 'react'
import styles from './styles.module.scss'
import IconButton from '../../Details/IconButton/IconButton';
import { Product as ProductModel } from '../../../models/product';

import { BiDotsVerticalRounded } from 'react-icons/bi'
import Popup from '../../Details/Popup/Popup';
import TaskButton from '../../Details/TaskButton/TaskButton';

interface ProductProps extends ProductModel {
  deleteProd: () => void
  editProd: () => void
}

const Product: React.FC<ProductProps> = ({ name, category, quantity, unit, price, editProd, deleteProd }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  
  return (
    <div className={styles.row}>
      <div className={`${styles.block}`}><span>{name}</span></div>
      <div className={`${styles.block}`}><span>{category}</span></div>
      <div className={`${styles.block}`}><span>{quantity}</span></div>
      <div className={`${styles.block}`}><span>{unit}</span></div>
      <div className={`${styles.block}`}><span>{price}</span></div>
      <div className={`${styles.block}`}>
        <IconButton onClick={() => setIsPopupOpen(true)}><BiDotsVerticalRounded style={{ fontSize: '1.2rem', color: 'grey' }} /></IconButton>
      </div>
      <Popup
        title={'Akcje produktu'}
        trigger={isPopupOpen}
        closePopup={() => setIsPopupOpen(false)}
        top={'10px'}
        right={'10px'}
      >
        <div className={styles.popupContent}>
          <TaskButton
            onClick={editProd}
            name={'Etytuj'}
            style={{ margin: '10px 0' }}
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

export default Product