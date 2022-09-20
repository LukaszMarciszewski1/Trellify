import React, { useState } from 'react'
import styles from './styles.module.scss'
import Modal from '../Details/Modal/Modal'
import ToolBar from './ToolBar/ToolBar'
import AddMaterial from './AddMaterial/AddMaterial'
import MaterialsList from './MaterialsList/MaterialsList'
import Input from '../Details/Input/Input'
import Header from './Header/Header'
import Box from '../Details/Box/Box'
import Popup from '../Details/Popup/Popup'
import { Product } from '../../models/product'
import EditMaterial from './EditMaterial/EditMaterial'

import {
  useGetAllProductsQuery,
  useDeleteProductMutation
} from "../../store/api/products";
import TaskButton from '../Details/TaskButton/TaskButton'
import Row from './MaterialsList/Row/Row'

interface StorageProps {
  data: Product[]
}

const Storage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const { data, error, isLoading, refetch } = useGetAllProductsQuery()
  const [deleteProduct] = useDeleteProductMutation()

  const handleEditProd = (prod: Product) => {
    setIsModalEditOpen(true)
    setCurrentProduct(prod)
    console.log(prod)
  }

  console.log(currentProduct?.name)

  return (
    <div className={styles.container}>
      {error && <h2>Error 500</h2>}
      <div className={styles.left}>
        <div className={styles.top}></div>
        <div className={styles.bottom}>
          <Header
            addNewProduct={() => setIsModalOpen(true)}
          />
          <MaterialsList>
            {
              isLoading ? <div>Loading...</div> : (
                data?.map(product => (
                  <Row
                    key={product._id}
                    _id={product._id}
                    name={product.name}
                    category={product.category}
                    quantity={product.quantity}
                    unit={product.unit}
                    price={`${product.price} zł`}
                    action={true}
                    editProd={() => handleEditProd(product)}
                    deleteProd={() => deleteProduct(product._id)}
                  />
                )
                ))
            }
          </MaterialsList>
        </div>
      </div>
      <div className={styles.right}></div>
      <Modal trigger={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <AddMaterial />
      </Modal>
      <Modal trigger={isModalEditOpen} closeModal={() => setIsModalEditOpen(false)}>
        {
          currentProduct && (
            <EditMaterial
              _id={currentProduct._id}
              defaultName={currentProduct.name}
              defaultCategory={currentProduct.category}
              defaultQuantity={currentProduct.quantity}
              defaultUnit={currentProduct.unit}
              defaultPrice={currentProduct.price}
            />
          )
        }
      </Modal>
    </div>
  )
}

export default Storage