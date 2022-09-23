import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { Product as ProductModel } from '../../../models/product'
import { BiCategory } from 'react-icons/bi'
import {ReduceReturnType} from '../Storage'

interface CategoriesListProps {
  data: ReduceReturnType | undefined
}
// type ReduceReturnType = Record<string, number>;

const CategoriesList: React.FC<CategoriesListProps> = ({ data }) => {
  // const [categories, setCategories] = useState<ReduceReturnType | undefined>()

  // useEffect(() => {
  //   setCategories(getCategories(data))
  // }, [data])

  // const getCategories = (data: ProductModel[] | undefined) => {
  //   if (!data) return
  //   const categories = [...data].map(product => product.category)
  //   const categoryObj = categories.reduce<ReduceReturnType>((acc, value) => ({
  //     ...acc,
  //     [value]: (acc[value] || 0) + 1
  //   }), {});

  //   return categoryObj
  // }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BiCategory fontSize={'1.5rem'} />
        <h4>Kategorie</h4>
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