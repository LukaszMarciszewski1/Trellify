import React from 'react'
import styles from './styles.module.scss'

type ContainerProps = {
  data: any
  children: JSX.Element | JSX.Element[];
  title: string
}

const Container: React.FC<ContainerProps> = ({ children, title, data }) => {
  const isDataExist = Array.isArray(data) ? (
    data.length ? true : false) : (
    data === null || data === undefined ? false : true)

  return (
    <>
      {
        isDataExist ? (
          <div className={styles.container}>
            <h4>{title}</h4>
            <div className={styles.items}>
              {children}
            </div>
          </div>
        ) : null
      }
    </>
  )
}

export default Container