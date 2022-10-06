import React, { useEffect, useState, useCallback } from 'react'
import styles from './styles.module.scss'
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "store/api/products"
import {
  useUpdateCardMutation,
} from "store/api/cards"
import {
  useUpdateBoardMutation,
} from 'store/api/boards'
import { Product as ProductModel } from 'models/product';
import Button from 'components/common/Button/Button'
import IconButton from 'components/common/IconButton/IconButton';
import { RiDeleteBinLine } from "react-icons/ri";
import { GiMaterialsScience } from 'react-icons/gi'

interface UsedProductsProps {
  cardId: string
  boardId: string
  usedMaterials: any
}

const UsedProducts: React.FC<UsedProductsProps> = ({ cardId, boardId, usedMaterials }) => {
  const { data: productsApi } = useGetAllProductsQuery()
  const [updateBoard] = useUpdateBoardMutation();
  const [updateCard] = useUpdateCardMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [selectProduct, setSelectProduct] = useState<any>({})
  const [productsList, setProductsList] = useState<ProductModel[]>(usedMaterials)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (!productsApi) return
    setSelectProduct(productsApi[0])
  }, [productsApi])

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!productsApi) return
    const product = [...productsApi].find(item => item._id === e.target.value)
    setSelectProduct(product)
  }

  const handleAddProductToList = () => {
    if ([...productsList].find(item => item._id === selectProduct._id)) {
      return alert('produkt został już dodany do listy')
    }
    const newProducts = [...productsList, selectProduct]
    setProductsList(newProducts)
    setChanged(true)
  }

  const handleOnChangeUsedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productsList && !productsApi) return
    const { id, valueAsNumber } = e.target
    const newProducts: ProductModel[] = []
    const targetIndex = [...productsList].findIndex(item => item._id === id);
    const productQuantity = productsApi?.filter(product => product._id === id).map(p => p.quantity)[0]
    const usedBefore = (usedMaterials[targetIndex].used ? usedMaterials[targetIndex].used : 0)
    //solution - cannot assign to read only property used of object
    productsList.map((product, index) => (newProducts[index] = { ...product }))

    if (targetIndex !== -1) {
      newProducts[targetIndex].used = valueAsNumber + usedBefore
      newProducts[targetIndex].quantity = productQuantity && productQuantity + usedBefore
      setProductsList(newProducts)
      setChanged(true)
    }
  }

  console.log(productsList)

  const handleRemoveFromList = (id: string) => {
    if (!productsList) return
    const newProductsList = [...productsList].filter(item => item._id !== id)
    setProductsList(newProductsList)
    updateCard({
      _id: cardId,
      usedMaterials: newProductsList
    })
    updateBoard({ _id: boardId })
    const restoreQuantityToStorage = Number([...productsList]
      .filter(product => product._id === id)
      .map(product => product.quantity))
    updateProduct({
      _id: id,
      quantity: restoreQuantityToStorage
    })
    setChanged(true)
  }

  const updateStorage = useCallback(() => {
    const products = [...productsList]
    products.map(product => {
      updateProduct({
        _id: product._id,
        quantity: product.used ? (product.quantity - product.used) : product.quantity
      })
    })

  }, [productsList])

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    updateCard({
      _id: cardId,
      usedMaterials: productsList
    })
    updateStorage()
    updateBoard({ _id: boardId })
    setChanged(false)
  }

  const getProductQuantityFromStorage = (id: string) => {
    if (!productsApi) return
    return [...productsApi].filter(product => product._id === id).map(product => product.quantity)[0]
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmitForm}>
        <label htmlFor="products">Dodaj produkt z magazynu</label>
        <div className={styles.selectContainer}>
          <select id='products' className={styles.select} onChange={handleSelectProduct}>
            {
              productsApi ? (
                productsApi.map(product => (
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
            productsList?.map((item) => (
              <div key={item._id}>
                <span>{item.name} {item.used ? `${item.used} ${item.unit}` : null}</span>
                <input
                  type="text"
                  name="quantity"
                  value={`stan: ${getProductQuantityFromStorage(item._id)} ${item.unit}`}
                  disabled />
                <input
                  id={item._id}
                  type="number"
                  name={item.name}
                  defaultValue={0}
                  max={getProductQuantityFromStorage(item._id)}
                  min={0}
                  onChange={handleOnChangeUsedValue}
                />
                <IconButton
                  onClick={() => handleRemoveFromList(item._id)}
                  style={{ marginLeft: '8px' }}>
                  <RiDeleteBinLine fontSize={'14px'} />
                </IconButton>
              </div>
            ))
          }
        </div>
        {
          productsList?.length ? (
            <Button
              title={'Zapisz'}
              type={'submit'}
              style={{ width: '100%', padding: '0.6rem' }}
              disabled={changed ? false : true} />
          ) : null
        }
      </form>
    </div>
  )
}

export default UsedProducts