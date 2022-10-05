import React, { useState } from 'react'
import styles from './styles.module.scss'
import { Product as ProductModel } from 'models/product';
import IconButton from 'components/common/IconButton/IconButton';
import Popup from 'components/common/Popup/Popup';
import TaskButton from 'components/common/TaskButton/TaskButton';
import { BiDotsVerticalRounded } from 'react-icons/bi'

interface ProductProps extends ProductModel {
  deleteProd: () => void
  editProd: () => void
}

const Product: React.FC<ProductProps> = ({ name, category, quantity, unit, price, editProd, deleteProd }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const quantityColor = quantity === 0 ? 'red' : 'initial'

  return (
    <div className={styles.row} style={{ color: quantityColor }}>
      <div className={`${styles.block}`}><span>{name}</span></div>
      <div className={`${styles.block}`}><span>{category}</span></div>
      <div className={`${styles.block}`}><span>{quantity}</span></div>
      <div className={`${styles.block}`}><span>{unit}</span></div>
      <div className={`${styles.block}`}><span>{price} zł</span></div>
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
    </div >
  )
}

export default Product