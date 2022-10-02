import React from 'react'
import styles from './styles.module.scss'
import { BiCategory } from 'react-icons/bi'
import { ReduceReturnType } from '../Storage'
interface CategoriesListProps {
  data: ReduceReturnType | undefined
}

const CategoriesList: React.FC<CategoriesListProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BiCategory fontSize={'1.5rem'} />
        <h4>Magazyn</h4>
      </div>
      {
        data ? Object.entries(data).map(([key, value]) => (
          <div key={key} className={styles.box}>
            <h5>{key}</h5>
            <span>{`ilość: ${value}`}</span>
          </div>
        )) : null
      }
    </div>
  )
}

export default CategoriesList