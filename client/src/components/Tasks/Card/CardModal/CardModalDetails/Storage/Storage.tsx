import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import {
  useGetAllProductsQuery,
  useDeleteProductMutation
} from "../../../../../../store/api/products"
import { Product as ProductModel } from '../../../../../../models/product';
import Button from '../../../../../Details/Button/Button'

const Storage: React.FC = () => {
  const { data, error, isLoading } = useGetAllProductsQuery()
  const [productList, setProductList] = useState<string[]>([])
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [list, setList] = useState<any>()

  useEffect(() => {
    if (!data) return
    const firstElement = [...data].map(product => product.name)
    setSelectProduct(firstElement[0])
    // setList(displayProductFromList())
  }, [data, productList])


  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!data) return
    setSelectProduct(e.target.value)
  }

  const handleAddProductToList = () => {
    if (!selectProduct) return
    setProductList([...productList, selectProduct])
    console.log(list)
  }

  const displayProductFromList = (data: ProductModel[] | undefined) => {
    if (!data) return
    return [...data].filter(p1 => productList.some(p2 => p1._id === p2))
  }

  // console.log(selectProduct)
  // console.log(productList)
  // console.log(displayProductFromList())


  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form>
          <label htmlFor="products">Dodaj z magazynu</label>
          <div className={styles.inputContainer}>
            <select className={styles.select} onChange={(e) => handleSelectProduct(e)}>
              {
                data ? (
                  data.map(product => (
                    <option key={product._id} value={product._id}>{product.name}</option>
                  ))
                ) : null
              }
            </select>
            <Button
              onClick={handleAddProductToList}
              title={'+'} type={'button'}
              style={{
                height: '35px',
                width: '35px',
                marginLeft: '10px'
              }} />
          </div>
        </form>
      </div>
      <div className={styles.list}>
        {
          displayProductFromList(data)?.map(item => (
            <div key={item._id}>
              <span>{item.name}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Storage