import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { useForm, useFieldArray } from 'react-hook-form'
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
import Input from '../../../../../Details/Input/Input';
import ErrorMessage from '../../../../../Details/Messages/ErrorMessage';
interface UsedProductsProps {
  cardId: string
}

interface UsedProducts extends ProductModel {
  used: number
}

const validation = {
  used: {
    required: true,
    pattern: /[0-9]/g
  },
}

const quantityErrors = (type: any) => {
  switch (type) {
    case 'required':
      return <ErrorMessage message={'Stan jest wymagany'} />
    case 'pattern':
      return <ErrorMessage message={'Stan jest niepoprawny'} />
    default:
      return null
  }
}

const UsedProducts: React.FC<UsedProductsProps> = ({ cardId }) => {
  const { data, error, isLoading } = useGetAllProductsQuery()
  const [updateCard] = useUpdateCardMutation()
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [productsIdList, setProductsIdList] = useState<string[]>([])
  const [products, setProducts] = useState<ProductModel[] | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsedProducts>();

  useEffect(() => {
    if (!data) return
    setSelectProduct(data[0]?._id)
  }, [data])

  useEffect(() => {
    handleSetProductsList()
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

  const handleSetProductsList = () => {
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

  }

  // const handleChange = (e) => {
  //   console.log(e.target.value)
  // }


  const handleAddProduct = (data: ProductModel) => {
    if (!products) return;
    const { used } = data
    const newObj = [...products].map(item => (
      { used: Number(used) }
    ))
    // setProducts(newObj)
    // updateCard({
    //   _id: cardId,
    //   usedMaterials: newObj
    // })
    console.log(newObj)
  }
  // console.log(products)



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
        <form className={styles.form} onSubmit={handleSubmit(handleAddProduct)}>
          {
            products?.map((item, index) => (
              <div key={item._id}>
                <span>{item.name}</span>
                <input type="text" name="name" value={`stan: ${item.quantity} ${item.unit}`} disabled />
                {/* <input type="number" name="name" defaultValue={item.quantity} min={1} max={item.quantity} /> */}
                <Input
                  id={'used'}
                  placeholder={'Użycie'}
                  label={'Użycie'}
                  type="number"
                  defaultValue={1}
                  minValue={0}
                  error={errors.used}
                  {...register("used", { ...validation.used })}
                />
                {quantityErrors(errors.used?.type)}
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