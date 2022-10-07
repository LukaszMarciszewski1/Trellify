import React from 'react'
import styles from './styles.module.scss'
import { BiCategory } from 'react-icons/bi'
import { ReduceReturnType } from '../Storage'
interface CategoriesListProps {
  data: ReduceReturnType | undefined
}

const CategoriesList: React.FC<CategoriesListProps> = ({ data }) => {
  return (
    <div className={styles.categoriesList}>
      <div className={styles.titleWrapper}>
        <BiCategory fontSize={'1.5rem'} />
        <h4>Magazyn</h4>
      </div>
      <div className={styles.listWrapper}>
        {
          data ? Object.entries(data).map(([name, quantity]) => (
            <div key={name} className={styles.box}>
              <h5>{name}</h5>
              <span>{`ilość: ${quantity}`}</span>
            </div>
          )) : null
        }
      </div>
    </div>
  )
}

export default CategoriesList