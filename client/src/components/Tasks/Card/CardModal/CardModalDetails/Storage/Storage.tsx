import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import {
  useGetAllProductsQuery,
  useDeleteProductMutation
} from "../../../../../../store/api/products"
import { Product as ProductModel } from '../../../../../../models/product';
import Button from '../../../../../Details/Button/Button'
import IconButton from '../../../../../Details/IconButton/IconButton';

const Storage: React.FC = () => {
  const { data, error, isLoading } = useGetAllProductsQuery()
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [productsIdList, setProductsIdList] = useState<string[]>([])
  const [products, setProducts] = useState<ProductModel[] | undefined>()

  useEffect(() => {
    if (!data) return
    setSelectProduct(data[0]._id)
  }, [data])

  useEffect(() => {
    displayProductFromList()
  }, [productsIdList])

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!data) return
    setSelectProduct(e.target.value)
  }

  const handleAddProductToList = () => {
    if (!data) return
    setProductsIdList([...productsIdList, selectProduct])

  }

  const displayProductFromList = () => {
    if (!data) return
    const products = [...data].filter(p1 => productsIdList.some(p2 => p1._id === p2))
    setProducts(products)
  }

  const handleRemoveFromList = (id: string) => {
    if (!products) return
    const newProducts = [...products].filter(item => item._id !== id)
    setProducts(newProducts)
  }

  return (
    <div className={styles.container}>
      <form className={styles.form}>
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
            title={'Dodaj'} type={'button'}
            style={{
              height: '35px',
              // width: '100px',
              marginLeft: '10px'
            }} />
        </div>
      </form>
      <div className={styles.list}>
        <form className={styles.form}>
          {
            products?.map(item => (
              <div key={item._id}>
                <span>{item.name}</span>
                <input type="text" name="name" value={`stan: ${item.quantity} ${item.unit}`} disabled />
                <input type="number" name="name" defaultValue={item.quantity} min={1} max={item.quantity} />
                <IconButton onClick={() => handleRemoveFromList(item._id)} style={{ marginLeft: '10px' }}>X</IconButton>
                {/* <Button
                  onClick={handleAddProductToList}
                  title={'X'} type={'button'}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    padding: '5px',
                    marginLeft: '10px'
                  }} /> */}
              </div>
            ))
          }
        </form>
      </div>
    </div>
  )
}

export default Storage