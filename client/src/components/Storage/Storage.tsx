import React, { useState } from 'react'
import styles from './styles.module.scss'
import Modal from '../Details/Modal/Modal'
import ToolBar from './ToolBar/ToolBar'
import AddMaterial from './AddMaterial/AddMaterial'
import MaterialsList from './MaterialsList/MaterialsList'
import Input from '../Details/Input/Input'
import Header from './Header/Header'
import Box from '../Details/Box/Box'

import {
  useGetAllProductsQuery
} from "../../store/api/products";

const Storage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, error, isLoading, refetch } = useGetAllProductsQuery()
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.top}></div>
        <div className={styles.bottom}>
            <Header
              addNewProduct={() => setIsModalOpen(true)}
            />
          <MaterialsList />
        </div>
      </div>
      <div className={styles.right}></div>
      <Modal trigger={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <AddMaterial />
      </Modal>
    </div>
  )
}

export default Storage




{/* <div className={`${styles.card} ${styles.leftPanel}`}>
<ToolBar setIsModalOpen={setIsModalOpen} />
<MaterialsList />
</div>
<div className={`${styles.card} ${styles.rightPanel}`}>
<ToolBar setIsModalOpen={setIsModalOpen} />
<Input
  id={'price'}
  name={''}
  placeholder={'Cena'}
  label={'Cena'}
  type="number"
  disabled={true}
/>
</div>
<Modal trigger={isModalOpen} closeModal={() => setIsModalOpen(false)}>
<AddMaterial />
</Modal> */}