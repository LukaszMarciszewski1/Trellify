import React, { useState } from 'react'
import styles from './styles.module.scss'
import TaskButton from '../../Details/TaskButton/TaskButton'
import { GoPlus } from 'react-icons/go'
import { BsFilter } from 'react-icons/bs'
import { FaFolder } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import Box from '../../Details/Box/Box'
import Button from '../../Details/Button/Button'
import IconButton from '../../Details/IconButton/IconButton'
import Popup from '../../Details/Popup/Popup'
import { ReduceReturnType } from '../Storage'

interface HeaderProps {
  addNewProduct: () => void
  categories: ReduceReturnType | undefined
  handleFilterCategory: (value: string) => void
}

const Header: React.FC<HeaderProps> = ({ categories, addNewProduct, handleFilterCategory }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <div className={styles.header}>
      <TaskButton
        icon={<GoPlus style={{ color: 'grey', fontSize: '1.2rem' }} />}
        name={'Dodaj produkt'}
        onClick={addNewProduct}
        style={{ width: '200px' }}
      />
      <div className={styles.filter}>
        <div className={styles.categoryName}><h3>Papiery Ofsetowe</h3></div>
        <div className={styles.filterBtn}>
          <TaskButton
            icon={<BsFilter style={{ color: 'grey', fontSize: '1.2rem' }} />}
            name={'Filtruj'}
            onClick={() => setIsPopupOpen(true)}
            style={{ width: '200px' }}
          />
        </div>
        <Popup
          title={'Filtruj kategorie'}
          trigger={isPopupOpen}
          closePopup={() => setIsPopupOpen(false)}
          top={'10px'}
          right={'10px'}
        >
          <>
            <TaskButton
              onClick={() => handleFilterCategory('all')}
              name={'Wszystkie'}
              style={{ margin: '8px 0' }}
            />
            {
              categories ? Object.entries(categories).map(([key, value]) => (
                <div key={key} className={styles.popupContent}>
                  <TaskButton
                    onClick={() => handleFilterCategory(key)}
                    name={key}
                    style={{ margin: '8px 0' }}
                  />
                </div>
              )) : null
            }
          </>
        </Popup>
      </div>
    </div>
  )
}

export default Header