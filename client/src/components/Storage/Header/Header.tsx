import React, { useState } from 'react'
import styles from './styles.module.scss'
import Popup from 'components/Details/Popup/Popup'
import TaskButton from 'components/Details/TaskButton/TaskButton'
import { ReduceReturnType } from '../Storage'
import { GoPlus } from 'react-icons/go'
import { BsFilter } from 'react-icons/bs'

interface HeaderProps {
  addNewProduct: () => void
  categories: ReduceReturnType | undefined
  handleFilterCategory: (value: string) => void
  activeCategory: string
  allCategoryValue: string
}

const Header: React.FC<HeaderProps> = ({ categories, allCategoryValue, activeCategory, addNewProduct, handleFilterCategory }) => {
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
        <div className={styles.categoryName}><h3>{activeCategory}</h3></div>
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
              onClick={() => handleFilterCategory(allCategoryValue)}
              name={allCategoryValue}
              style={{ margin: '8px 0' }}
            />
            {
              categories ? Object.entries(categories).map(([key]) => (
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