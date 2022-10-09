import React from 'react'
import styles from './styles.module.scss'
import Container from '../../Container/Container'
import { Product as ProductModel } from 'models/product'

interface MaterialsListProps {
  materials: ProductModel[] | undefined
  setTrigger: (value: boolean) => void
}

const MaterialsList: React.FC<MaterialsListProps> = ({ materials, setTrigger }) => {
  return (
    <Container data={materials} title={'Wykorzystane materiały'}>
      <>
        {
          materials?.map((material) => (
            <div
              key={material._id}
              className={styles.materials}
              onClick={() => setTrigger(true)}
            >
              <span>{material.name}: {material.used} {material.unit}</span>
            </div>
          ))
        }
      </>
    </Container>
  )
}

export default MaterialsList