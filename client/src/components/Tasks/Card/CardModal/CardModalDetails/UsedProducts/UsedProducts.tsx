import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import {
  useGetAllProductsQuery,
  useDeleteProductMutation
} from "../../../../../../store/api/products"
import {
  useUpdateCardMutation,
  useDeleteCardMutation
} from "../../../../../../store/api/cards"
import { Product as ProductModel } from '../../../../../../models/product';
import Button from '../../../../../Details/Button/Button'
import IconButton from '../../../../../Details/IconButton/IconButton';

interface UsedProductsProps {
  cardId: string
}

interface ProductValue extends ProductModel {
  used: number
}

const UsedProducts: React.FC<UsedProductsProps> = ({ cardId }) => {
  const { data, error, isLoading } = useGetAllProductsQuery()
  const [updateCard] = useUpdateCardMutation()
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [productsIdList, setProductsIdList] = useState<string[]>([])
  const [products, setProducts] = useState<ProductModel[] | undefined>()

  useEffect(() => {
    if (!data) return
    setSelectProduct(data[0]?._id)
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
    if ([...productsIdList].find(item => item === selectProduct)) {
      return alert('produkt został już dodany do listy')
    }
    setProductsIdList([...productsIdList, selectProduct])
  }

  const displayProductFromList = () => {
    if (!data) return
    const products = [...data].filter(p1 => productsIdList.some(p2 => p1._id === p2))
    setProducts(products)
  }

  const handleRemoveFromList = (id: string) => {
    if (!productsIdList) return
    const newProductsIdList = [...productsIdList].filter(item => item !== id)
    setProductsIdList(newProductsIdList)
  }

  const handleAddProductsToCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('dziala')
    updateCard({
      _id: cardId,
      usedProducts: products
    })
  }

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <label htmlFor="products">Dodaj produkt z magazynu</label>
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
              height: '38px',
              marginLeft: '10px'
            }} />
        </div>
      </form>
      <div className={styles.list}>
        <form className={styles.form} onSubmit={(e) => handleAddProductsToCard(e)}>
          {
            products?.map(item => (
              <div key={item._id}>
                <span>{item.name}</span>
                <input type="text" name="name" value={`stan: ${item.quantity} ${item.unit}`} disabled />
                <input type="number" name="name" defaultValue={item.quantity} min={1} max={item.quantity} />
                <IconButton onClick={() => handleRemoveFromList(item._id)} style={{ marginLeft: '8px' }}>X</IconButton>
              </div>
            ))
          }
          {
            products?.length ? (
              <Button title={'Zapisz'} type={'submit'} style={{ width: '100%', padding: '0.6rem', marginTop: '10px' }} />
            ) : null
          }
        </form>
      </div>
      <h3>Is in progress...</h3>
    </div>
  )
}

export default UsedProducts