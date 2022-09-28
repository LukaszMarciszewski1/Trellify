import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../Details/Input/Input';
import ErrorMessage from '../../Details/Messages/ErrorMessage';
import styles from './styles.module.scss'
import Button from '../../Details/Button/Button';
import { Product as ProductModel } from '../../../models/product';
import { ReduceReturnType } from '../Storage'

const validation = {
  name: {
    required: true,
    maxLength: 40,
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

interface DefaultValuesProps {
  _id?: string
  defaultName?: string
  defaultCategory?: string
  defaultQuantity?: number
  defaultUnit?: string
  defaultPrice?: number
}

interface AddProductFormProps extends DefaultValuesProps {
  categoryList: ReduceReturnType | undefined
  formTitle: string
  handleSubmitForm: (data: ProductModel) => void
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  defaultName,
  defaultCategory,
  defaultQuantity,
  defaultUnit,
  defaultPrice,
  categoryList,
  formTitle,
  handleSubmitForm
}) => {

  const [isSuccess, setIsSuccess] = useState(false)
  const [categorySwitch, setCategorySwitch] = useState(true)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductModel>();

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
        return <ErrorMessage message={'Stan jest wymagany'} />
      case 'pattern':
        return <ErrorMessage message={'Stan jest niepoprawny'} />
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

  return (
    <div className={styles.container}>
      <h2>{formTitle}</h2>
      <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <label htmlFor="name">Nazwa</label>
              <Input
                id={'name'}
                placeholder={'Nazwa'}
                label={'Nazwa'}
                type="text"
                defaultValue={defaultName}
                error={errors.name}
                {...register("name", { ...validation.name })}
              />
              {nameErrors(errors.name?.type)}
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="quantity">Stan</label>
              <Input
                id={'quantity'}
                placeholder={'Stan'}
                label={'Stan'}
                type="number"
                defaultValue={defaultQuantity}
                minValue={0}
                error={errors.quantity}
                {...register("quantity", { ...validation.quantity })}
              />
              {quantityErrors(errors.quantity?.type)}
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="price">Cena</label>
              <Input
                id={'price'}
                placeholder={'Cena'}
                label={'Cena'}
                type="number"
                step="0.01"
                defaultValue={defaultPrice}
                minValue={0}
                error={errors.price}
                {...register("price", { ...validation.price })}
              />
              {priceErrors(errors.price?.type)}
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <label htmlFor="unit">Jednostka</label>
              <select {...register('unit')} className={styles.select} defaultValue={defaultUnit}>
                <option value="szt">szt</option>
                <option value="m2">m2</option>
                <option value="mb">mb</option>
                <option value="ark">ark</option>
                <option value="ryz">ryz</option>
                <option value="litry">litry</option>
                <option value="inne">inne</option>
              </select>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.selectGroup}>
                <input
                  type="checkbox"
                  checked={categorySwitch}
                  onChange={() => setCategorySwitch(categorySwitch => !categorySwitch)} />
                <label htmlFor="category">Dodaj nową kategorię</label>
              </div>
              <Input
                id={'category'}
                placeholder={'Dodaj kategorię'}
                label={'Kategoria'}
                type="text"
                defaultValue={defaultCategory}
                error={errors.category}
                disabled={!categorySwitch}
                {...register("category", { ...validation.category })}
              />
              {categoryErrors(errors.category?.type)}
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.selectGroup}>
                <input
                  type="checkbox"
                  checked={!categorySwitch}
                  onChange={() => setCategorySwitch(categorySwitch => !categorySwitch)} />
                <label htmlFor="category">Wybierz kategorię</label>
              </div>
              {
                categoryList ? (
                  <select
                    {...(!categorySwitch && { ...register('category') })}
                    className={styles.select}
                    disabled={categorySwitch}
                    defaultValue={defaultCategory}>
                    {
                      Object.entries(categoryList).map(([category]) => (
                        <option key={category} value={category}>{category}</option>
                      ))
                    }
                  </select>
                ) : null
              }
            </div>
          </div>
        </div>
        <div className={styles.actionForm}>
          <Button title={'Zapisz'} type={'submit'} style={{ width: '100%', padding: '0.8rem' }} />
          <h3>{isSuccess && 'Produkt został dodany'}</h3>
        </div>
      </form>
    </div>
  )
}

export default AddProductForm