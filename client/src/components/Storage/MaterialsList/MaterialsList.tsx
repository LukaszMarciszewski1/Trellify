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
    <div >
      <div className={styles.head}>
        <Row name={'Nazwa'} quantity={'Stan'} unit={'Jedn.'} price={'Cena'} action={false} />
      </div>
      {
        isLoading ? <div>Loading...</div> : (
          data?.map(product => (
            <Row
              key={product._id}
              name={product.name}
              quantity={product.quantity}
              unit={product.unit}
              price={product.price}
              action={true} />
          )
          ))
      }
    </div>
  )
}

export default MaterialsList