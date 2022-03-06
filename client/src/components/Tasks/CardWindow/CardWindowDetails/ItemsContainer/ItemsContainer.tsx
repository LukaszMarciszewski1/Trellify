import React from 'react'
import styles from './styles.module.scss'

type Props = {
  children: any
  title: string
  data: []
}

const ItemsContainer: React.FC<Props> = ({ children, title, data }) => {
  const activeList = data.filter((item: { active: boolean }) => item.active === true)

  return (
    <>
      {
        // activeList.length ? (
        <div className={styles.container}>
          <p>{title}</p>
          <div className={styles.items}>
            {children}
          </div>
        </div>
        // ) : null
      }
    </>
  )
}

export default ItemsContainer