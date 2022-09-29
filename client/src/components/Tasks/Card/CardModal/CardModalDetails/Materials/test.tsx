import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
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
  usedMaterials: any
}

const UsedProducts: React.FC<UsedProductsProps> = ({ cardId, usedMaterials }) => {
  const { data, error, isLoading } = useGetAllProductsQuery()
  const [updateCard] = useUpdateCardMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [selectProduct, setSelectProduct] = useState<any>({})
  const [products, setProducts] = useState<any>([])

  useEffect(() => {
    if (!data) return
    setSelectProduct(data[0])
  }, [data])

  useEffect(() => {
    setProducts(usedMaterials)
  }, [data])

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!data) return
    const product = [...data].find(item => item._id === e.target.value)
    setSelectProduct(product)
  }

  const handleAddProductToList = () => {
    if ([...products].find(item => item._id === selectProduct._id)) {
      return alert('produkt został już dodany do listy')
    }
    const newProducts = [...products, { ...selectProduct, used: 1 }]
    setProducts(newProducts)
  }

  const handleOnChangeUsedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!products) return;
    const { id, valueAsNumber } = e.target;
    const newProductsValue = [...products]
    const targetIndex = newProductsValue.findIndex(item => item._id == id);
    if (targetIndex !== -1) {
      newProductsValue[targetIndex].used = valueAsNumber
      setProducts(newProductsValue)
    }
  }
  console.log(usedMaterials)


  const handleRemoveFromList = (id: string) => {
    if (!products) return
    const newProductsList = [...products].filter(item => item._id !== id)
    setProducts(newProductsList)
  }


  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    updateCard({
      _id: cardId,
      usedMaterials: products
    })
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmitForm}>
        <label htmlFor="products">Dodaj produkt z magazynu</label>
        <div className={styles.selectContainer}>
          <select className={styles.select} onChange={handleSelectProduct}>
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
            title={'Dodaj'}
            type={'button'}
            style={{
              height: '38px',
              marginLeft: '10px'
            }} />
        </div>
        <div className={styles.list}>
          {
            products?.map((item: { _id: string; name: string; quantity: number; unit: string; used: number }) => (
              <div key={item._id}>
                <span>{item.name}</span>
                <input type="text" name="quantity" value={`stan: ${item.quantity} ${item.unit}`} disabled />
                <input
                  id={item._id}
                  type="number"
                  name={item.name}
                  defaultValue={item.used}
                  onChange={handleOnChangeUsedValue}
                />
                <IconButton onClick={() => handleRemoveFromList(item._id)} style={{ marginLeft: '8px' }}>X</IconButton>
              </div>
            ))
          }
        </div>
        {
          products?.length ? (
            <Button title={'Zapisz'} type={'submit'} style={{ width: '100%', padding: '0.6rem' }} />
          ) : null
        }
      </form>
    </div>
  )
}

export default UsedProducts