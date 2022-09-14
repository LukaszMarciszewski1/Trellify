import React from 'react'
import styles from './styles.module.scss'
import IconButton from '../../../Details/IconButton/IconButton';

import { BiDotsVerticalRounded } from 'react-icons/bi'

interface RowProps {
  name: string
  quantity: number | string
  unit: string
  price: number | string
  action?: boolean
}
//categorie !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const Row: React.FC<RowProps> = ({ name, quantity, unit, price, action }) => {
  return (
    <div className={action ? `${styles.row}` : `${styles.head}`}>
      <div className={`${styles.block} ${styles.r1}`}><p>{name}</p></div>
      <div className={`${styles.block} ${styles.r2}`}><p>{quantity}</p></div>
      <div className={`${styles.block} ${styles.r3}`}><p>{unit}</p></div>
      <div className={`${styles.block} ${styles.r4}`}><p>{price}</p></div>
      <div className={`${styles.block} ${styles.r5}`}>
        {action ? <IconButton onClick={() => console.log('okk')}><BiDotsVerticalRounded style={{ fontSize: '1.2rem', color: 'grey' }} /></IconButton> : null}
      </div>
    </div>
  )
}

export default Row