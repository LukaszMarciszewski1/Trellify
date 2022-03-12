import React from 'react'
import styles from './styles.module.scss'

type Props = {
  data: any
  children: any
  title: string
}

const ItemsContainer: React.FC<Props> = ({ children, title, data }) => {
  const isDataExist = Array.isArray(data) ? (data.length ? true : false) : (data === null || data === undefined ? false : true)

  return (
    <>
      {
        isDataExist ? (
          <div className={styles.container}>
            <p>{title}</p>
            <div className={styles.items}>
              {children}
            </div>
          </div>
        ) : null
      }
    </>
  )
}

export default ItemsContainer