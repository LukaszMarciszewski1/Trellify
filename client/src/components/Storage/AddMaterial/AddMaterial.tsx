import { useForm } from 'react-hook-form'
import Input from '../../Details/Input/Input';
import Loading from '../../Details/Loading/Loading';
import ErrorMessage from '../../Details/Messages/ErrorMessage';
import styles from './styles.module.scss'
import Button from '../../Details/Button/Button';
import { Product } from '../../../models/product';

import {
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../../../store/api/products";

const validation = {
  name: {
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

const MaterialForm: React.FC = () => {
  const [addProduct] = useAddProductMutation()
  const {
    register,
    handleSubmit,
    watch,
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
    const { name, quantity, unit, price } = data
    addProduct({
      name,
      quantity,
      unit,
      price
    })
  }

  // <Row name='Nazwa' quantity={'Stan'} unit={'Jedn.'} price={'Cena'} />

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
              id={'quantity'}
              placeholder={'Stan'}
              label={'Stan'}
              type="number"
              error={errors.quantity}
              {...register("quantity", { ...validation.quantity })}
            />
            {quantityErrors(errors.quantity?.type)}
          </div>
          <div className={styles.formGroup}>
            <select {...register('unit')}>
              <option value="m2">female</option>
              <option value="ark">male</option>
              <option value="szt">other</option>
              <option value="inne">other</option>
            </select>
            <Input
              id={'price'}
              placeholder={'Cena'}
              label={'Cena'}
              type="number"
              error={errors.price}
              {...register("price", { ...validation.price })}
            />
            {priceErrors(errors.price?.type)}
          </div>
        </div>
        <Button title={'Dodaj'} type={'submit'} />
      </form>
    </div>
  )
}

export default MaterialForm