import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { useDebouncedCallback } from 'use-debounce';
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
import Button from 'components/Details/Button/Button'
import IconButton from 'components/Details/IconButton/IconButton';
interface UsedProductsProps {
  cardId: string
  boardId: string
  usedMaterials: any
}

const UsedProducts: React.FC<UsedProductsProps> = ({ cardId, boardId, usedMaterials }) => {
  const { data: productsApi, error, isLoading } = useGetAllProductsQuery()
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
    const newProducts = [...productsList, { ...selectProduct, used: 1 }]
    setProductsList(newProducts)
    setChanged(true)
  }

  const handleOnChangeUsedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productsList) return;
    const { id, valueAsNumber } = e.target;
    const newProducts: ProductModel[] = []
    const targetIndex = productsList.findIndex(item => item._id === id);
    //solution - cannot assign to read only property used of object
    productsList.map((product, index) => (newProducts[index] = { ...product }))

    if (targetIndex !== -1) {
      newProducts[targetIndex].used = valueAsNumber
      setProductsList(newProducts)
      setChanged(true)
    }
  }

  // const handleOnChangeUsedValue = useDebouncedCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (!productsList) return;
  //     const { id, valueAsNumber } = e.target;
  //     const newProducts: ProductModel[] = []
  //     const targetIndex = productsList.findIndex(item => item._id === id);
  //     //solution - cannot assign to read only property used of object
  //     productsList.map((product, index) => (newProducts[index] = { ...product }))

  //     if (targetIndex !== -1) {
  //       newProducts[targetIndex].used = valueAsNumber
  //       setProductsList(newProducts)
  //       setChanged(true)
  //     }
  //   }, 500
  // )

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

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const products = [...productsList]
    updateCard({
      _id: cardId,
      usedMaterials: productsList
    })
    products.map(product => {
      updateProduct({
        _id: product._id,
        quantity: product.used && (product.quantity - product.used)
      })
    })
    updateBoard({ _id: boardId })
    setChanged(false)
  }

  const getProductQuantityFromStorage = (id: string) => {
    if (!productsApi) return
    const productQuantity = productsApi.filter(product => product._id === id).map(product => product.quantity)
    return productQuantity.length ? productQuantity : 0
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
                <span>{item.name}</span>
                <input
                  type="text"
                  name="quantity"
                  value={`stan: ${getProductQuantityFromStorage(item._id)} ${item.unit}`}
                  disabled />
                <input
                  id={item._id}
                  type="number"
                  name={item.name}
                  defaultValue={item.used}
                  max={!getProductQuantityFromStorage(item._id) ? item.used : item.quantity}
                  min={1}
                  onChange={handleOnChangeUsedValue}
                />
                <IconButton
                  onClick={() => handleRemoveFromList(item._id)}
                  style={{ marginLeft: '8px' }}>X
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