import React, { useState } from 'react'
import Row from './Row/Row'
import styles from './styles.module.scss'
import {
  useGetAllProductsQuery
} from "../../../store/api/products";
import IconButton from '../../Details/IconButton/IconButton';
import Popup from '../../Details/Popup/Popup';
import TaskButton from '../../Details/TaskButton/TaskButton';
import { TiArrowSortedDown } from 'react-icons/ti'


const MaterialsList: React.FC = ({ children }) => {
  const { data, error, isLoading, refetch } = useGetAllProductsQuery()
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const show = (product: string | undefined) => {
    console.log(product)
  }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Row _id={'head'} name={'Nazwa'} category={'Kategoria'} quantity={'Stan'} unit={'Jedn.'} price={'Cena'} action={false} deleteProd={function (): void {
          throw new Error('Function not implemented.');
        } } editProd={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </div>
      <div className={styles.list}>
        {children}
      </div>
    </div>
  )
}

export default MaterialsList



{/* <div className={styles.container}>
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
          action={true}
        >
          <div className={styles.popupContent}>
            <TaskButton
              onClick={editProduct}
              name={'Etytuj'}
            />
            <TaskButton
              onClick={deleteProduct}
              name={'Usuń'}
            />
          </div>
        </Row>
      )
      ))
  }
</div>
</div> */}