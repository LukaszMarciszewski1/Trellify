import React, { useState } from 'react'
import styles from './styles.module.scss'
import { BiCheck } from 'react-icons/bi';

const colors = [
  '#FB8B24',
  '#9575cd',
  '#F36935',
  '#EA4746',
  '#AE0366',
]

const Labels: React.FC = () => {

  const [select, setSelect] = useState(false)

  const selectItem = (e: any, color: any) => {

  }

  return (
    <div className={styles.container}>
      <h4>Etykiety</h4>
      <ul>
        {
          colors.map((color, index) => (
            <li onClick={(e) => selectItem(e, color)} key={index} style={{ backgroundColor: `${color}` }} className={styles.boxColor}>
              {
                select ? < BiCheck /> : null
              }
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Labels