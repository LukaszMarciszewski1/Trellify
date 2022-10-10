/* eslint-disable array-callback-return */
import React, { useEffect, useState, useCallback } from 'react'
import styles from './styles.module.scss'
import { Product as ProductModel } from 'models/product';
import Button from 'components/common/Button/Button'
import IconButton from 'components/common/IconButton/IconButton';
import Popup from 'components/common/Popup/Popup'
import { RiDeleteBinLine } from "react-icons/ri";

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

interface MaterialsPopupProps {
  cardId: string
  boardId: string
  usedProducts: any
  trigger: boolean
  setTrigger: (value: boolean) => void
}

const MaterialsPopup: React.FC<MaterialsPopupProps> = ({
  cardId,
  boardId,
  usedProducts,
  trigger,
  setTrigger
}) => {
  const { data: productsApi } = useGetAllProductsQuery()
  const [updateBoard] = useUpdateBoardMutation();
  const [updateCard] = useUpdateCardMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [selectMaterial, setSelectMaterial] = useState<any>({})
  const [materialsList, setMaterialsList] = useState<ProductModel[]>(usedProducts)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (!productsApi) return
    setSelectMaterial(productsApi[0])
  }, [productsApi])

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!productsApi) return
    const product = [...productsApi].find(item => item._id === e.target.value)
    setSelectMaterial(product)
  }

  const handleAddMaterialToList = () => {
    if ([...materialsList].find(item => item._id === selectMaterial._id)) {
      return alert('produkt został już dodany do listy')
    }
    const newMaterialsList = [...materialsList, { ...selectMaterial, used: 0 }]
    setMaterialsList(newMaterialsList)
    setChanged(true)
  }

  const handleOnChangeUsedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!materialsList && !productsApi) return
    const { id, valueAsNumber } = e.target
    const newMaterialsList: ProductModel[] = []
    const targetIndex = [...materialsList].findIndex(item => item._id === id);
    const materialQuantity = productsApi?.filter(product => product._id === id).map(p => p.quantity)[0]
    const usedBefore = (usedProducts[targetIndex].used ? usedProducts[targetIndex].used : 0)
    //solution - cannot assign to read only property used of object
    materialsList.map((material, index) => (newMaterialsList[index] = { ...material }))

    if (targetIndex !== -1) {
      newMaterialsList[targetIndex].used = valueAsNumber + usedBefore
      newMaterialsList[targetIndex].quantity = materialQuantity && materialQuantity + usedBefore
      setMaterialsList(newMaterialsList)
      setChanged(true)
    }
  }

  const handleRemoveFromList = (id: string) => {
    if (!materialsList) return
    const newMaterialsList = [...materialsList].filter(item => item._id !== id)
    setMaterialsList(newMaterialsList)
    updateCard({
      _id: cardId,
      usedProducts: newMaterialsList
    })
    updateBoard({ _id: boardId })
    const restoreQuantityToStorage = Number([...materialsList]
      .filter(product => product._id === id)
      .map(product => product.quantity))
    updateProduct({
      _id: id,
      quantity: restoreQuantityToStorage
    })
    setChanged(true)
  }

  const updateStorage = useCallback(() => {
    const materials = [...materialsList]
    materials.map(material => {
      updateProduct({
        _id: material._id,
        quantity: material.used ? (material.quantity - material.used) : material.quantity
      })
    })

  }, [materialsList, updateProduct])

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    updateCard({
      _id: cardId,
      usedProducts: materialsList
    })
    updateStorage()
    updateBoard({ _id: boardId })
    setChanged(false)
  }

  const getProductQuantityFromStorage = (id: string) => {
    if (!productsApi) return
    const productQuantity = [...productsApi]
      .filter(product => product._id === id)
      .map(product => product.quantity)[0]
    return productQuantity ? productQuantity : 0
  }

  return (
    <Popup
      title={'Wykorzystane materiały'}
      trigger={trigger}
      closePopup={() => setTrigger(false)}
    >
      <div className={styles.materialsFormContainer}>
        <form className={styles.materialsForm} onSubmit={handleSubmitForm}>
          <label htmlFor="products">Dodaj produkt z magazynu</label>
          <div className={styles.selectContainer}>
            <select id='products' onChange={handleSelectProduct}>
              {
                productsApi ? (
                  productsApi.map(product => (
                    <option key={product._id} value={product._id}>{product.name}</option>
                  ))
                ) : null
              }
            </select>
            <Button
              onClick={handleAddMaterialToList}
              title={'Dodaj'}
              type={'button'}
              style={{
                height: '38px',
                marginLeft: '10px'
              }} />
          </div>
          <div className={styles.materialsList}>
            {
              materialsList?.map((material) => (
                <div key={material._id} className={styles.formGroup}>
                  <span>{material.name} {material.used ? `${material.used} ${material.unit}` : null}</span>
                  <div>
                    <input
                      type="text"
                      name="quantity"
                      value={`stan: ${getProductQuantityFromStorage(material._id)} ${material.unit}`}
                      disabled />
                    <input
                      id={material._id}
                      type="number"
                      name={material.name}
                      defaultValue={0}
                      max={getProductQuantityFromStorage(material._id)}
                      min={0}
                      onChange={handleOnChangeUsedValue}
                    />
                    <IconButton
                      onClick={() => handleRemoveFromList(material._id)}
                      style={{ marginLeft: '8px' }}>
                      <RiDeleteBinLine fontSize={'14px'} />
                    </IconButton>
                  </div>
                </div>
              ))
            }
          </div>
          {
            materialsList?.length ? (
              <Button
                title={'Zapisz'}
                type={'submit'}
                style={{ width: '100%', padding: '0.6rem' }}
                disabled={changed ? false : true} />
            ) : null
          }
        </form>
      </div>
    </Popup>
  )
}

export default MaterialsPopup