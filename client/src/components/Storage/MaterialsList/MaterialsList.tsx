import React from 'react'
import Row from './Row/Row'
import styles from './styles.module.scss'
import {
  useGetAllProductsQuery
} from "../../../store/api/products";
import IconButton from '../../Details/IconButton/IconButton';

const MaterialsList: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetAllProductsQuery()
  console.log(data)

  //DODAĆ KATEGORIĘ DO PRODUKTU ///
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Row name={'Nazwa'} category={'Kategoria'} quantity={'Stan'} unit={'Jedn.'} price={'Cena'} action={false} />
      </div>
      <div className={styles.list}>
        {
          isLoading ? <div>Loading...</div> : (
            data?.map(product => (
              <Row
                key={product._id}
                name={product.name}
                category={product.category}
                quantity={product.quantity}
                unit={product.unit}
                price={`${product.price} zł`}
                action={true} />
            )
            ))
        }
      </div>
    </div>
  )
}

export default MaterialsList