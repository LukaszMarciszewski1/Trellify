import React from 'react'
import styles from './styles.module.scss'
import IconButton from '../../../Details/IconButton/IconButton';
import { Product } from '../../../../models/product';

import { BiDotsVerticalRounded } from 'react-icons/bi'

interface RowProps extends Product {
  action?: boolean
  onClick?: () => void
}
//categorie !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const Row: React.FC<RowProps> = ({ name, category, quantity, unit, price, action, onClick }) => {
  return (
    <div className={action ? `${styles.row}` : `${styles.head}`}>
      <div className={`${styles.block} ${styles.r1}`}><p>{name}</p></div>
      <div className={`${styles.block} ${styles.r2}`}><p>{category}</p></div>
      <div className={`${styles.block} ${styles.r3}`}><p>{quantity}</p></div>
      <div className={`${styles.block} ${styles.r4}`}><p>{unit}</p></div>
      <div className={`${styles.block} ${styles.r5}`}><p>{price}</p></div>
      <div className={`${styles.block} ${styles.r6}`}>
        {action ? <IconButton onClick={onClick}><BiDotsVerticalRounded style={{ fontSize: '1.2rem', color: 'grey' }} /></IconButton> : null}
      </div>
    </div>
  )
}

export default Row