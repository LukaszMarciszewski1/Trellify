import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../Details/Input/Input';
import Loading from '../../Details/Loading/Loading';
import ErrorMessage from '../../Details/Messages/ErrorMessage';
import styles from './styles.module.scss'
import Button from '../../Details/Button/Button';
import { Product } from '../../../models/product';

import { useAddProductMutation } from "../../../store/api/products";

const validation = {
  name: {
    required: true,
    maxLength: 20,
    minLength: 2,
  },
  category: {
    required: true,
    maxLength: 20,
    minLength: 2,
  },
  quantity: {
    required: true,
    pattern: /[0-9]/g
  },
  price: {
    required: true,
    pattern: /[0-9]/g
  }
}

const AddProductForm: React.FC = () => {
  const [addProduct] = useAddProductMutation()
  const [isSuccess, setIsSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>();

  const nameErrors = (type: any) => {
    switch (type) {
      case 'required':
        return <ErrorMessage message={'Nazwa jest wymagana'} />
      case 'minLength':
        return <ErrorMessage message={'Nazwa musi zawierać conajmiej 2 znaki'} />
      case 'maxLength':
        return <ErrorMessage message={'Nazwa może zawierać maksymalnie 20 znaków'} />
      default:
        return null
    }
  }

  const categoryErrors = (type: any) => {
    switch (type) {
      case 'required':
        return <ErrorMessage message={'Kategoria jest wymagana'} />
      case 'minLength':
        return <ErrorMessage message={'Kategoria musi zawierać conajmiej 2 znaki'} />
      case 'maxLength':
        return <ErrorMessage message={'Kategoria może zawierać maksymalnie 20 znaków'} />
      default:
        return null
    }
  }

  const quantityErrors = (type: any) => {
    switch (type) {
      case 'required':
        return <ErrorMessage message={'Email jest wymagany'} />
      case 'pattern':
        return <ErrorMessage message={'Email jest niepoprawny'} />
      default:
        return null
    }
  }

  const priceErrors = (type: any) => {
    switch (type) {
      case 'required':
        return <ErrorMessage message={'Hasło jest wymagane'} />
      case 'pattern':
        return <ErrorMessage message={'Hasło musi zawierać: co najmniej 8 znaków, 1 cyfrę, 1 małą literę i 1 wielką literę'} />
      default:
        return null
    }
  }

  const handleAddProduct = (data: Product) => {
    console.log(data)
    const { name, category, quantity, unit, price } = data
    addProduct({
      name,
      category,
      quantity,
      unit,
      price
    })
    setIsSuccess(true)
  }
  // setTimeout(() => setIsSuccess(false), 3000)

  return (
    <div className={styles.container}>
      <h2>Dodaj produkt</h2>
      <form className={styles.form} onSubmit={handleSubmit(handleAddProduct)}>
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <Input
              id={'name'}
              placeholder={'Nazwa'}
              label={'Nazwa'}
              type="text"
              error={errors.name}
              {...register("name", { ...validation.name })}
            />
            {nameErrors(errors.name?.type)}
            <Input
              id={'category'}
              placeholder={'Kategoria'}
              label={'Kategoria'}
              type="text"
              error={errors.category}
              {...register("category", { ...validation.category })}
            />
            {categoryErrors(errors.category?.type)}
            <Input
              id={'quantity'}
              placeholder={'Stan'}
              label={'Stan'}
              type="number"
              minValue={0}
              error={errors.quantity}
              {...register("quantity", { ...validation.quantity })}
            />
            {quantityErrors(errors.quantity?.type)}
          </div>
          <div className={styles.formGroup}>
            <select {...register('unit')} className={styles.select}>
              <option value="m2">m2</option>
              <option value="ark">ark.</option>
              <option value="ryz">ryz</option>
              <option value="szt">szt.</option>
              <option value="litry">litry</option>
              <option value="inne">inne</option>
            </select>
            <Input
              id={'price'}
              placeholder={'Cena'}
              label={'Cena'}
              type="number"
              step="0.01"
              minValue={0}
              error={errors.price}
              {...register("price", { ...validation.price })}
            />
            {priceErrors(errors.price?.type)}
          </div>
        </div>
        <div className={styles.actionForm}>
          <Button title={'Dodaj produkt'} type={'submit'} />
          <h3>{isSuccess && 'Produkt został dodany'}</h3>
        </div>
      </form>
    </div>
  )
}

export default AddProductForm