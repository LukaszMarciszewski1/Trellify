import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { Product as ProductModel } from '../../../models/product'
import { BiCategory } from 'react-icons/bi'

interface CategoriesListProps {
  data: ProductModel[] | undefined
}
type ReduceReturnType = Record<string, number>;

const CategoriesList: React.FC<CategoriesListProps> = ({ data }) => {
  const [categories, setCategories] = useState<ReduceReturnType | undefined>()

  useEffect(() => {
    setCategories(getDuplicateElements(data))
  }, [data])

  const getDuplicateElements = (data: ProductModel[] | undefined) => {
    if (!data) return
    const categories = [...data].map(product => product.category)
    const categoryObj = categories.reduce<ReduceReturnType>((acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }), {});

    return categoryObj
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BiCategory fontSize={'1.5rem'} />
        <h4>Kategorie</h4>
      </div>
      {
        categories ? Object.entries(categories).map(([key, value]) => (
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