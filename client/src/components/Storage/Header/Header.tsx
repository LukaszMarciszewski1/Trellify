import React from 'react'
import styles from './styles.module.scss'
import TaskButton from '../../Details/TaskButton/TaskButton'
// import Filters from './Filters/Filters'
import { GoPlus } from 'react-icons/go'
import { BsFilter } from 'react-icons/bs'
import { FaFolder } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import Box from '../../Details/Box/Box'
import Button from '../../Details/Button/Button'
import IconButton from '../../Details/IconButton/IconButton'


interface HeaderProps {
  addNewProduct: () => void
}

const Header: React.FC<HeaderProps> = ({ addNewProduct }) => {
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
            onClick={addNewProduct}
            style={{ width: '200px' }}
          />
        </div>
      </div>
    </div>
  )
}

export default Header