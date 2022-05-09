import React from 'react'
import styles from './styles.module.scss'
import Sidebar from './Sidebar/Sidebar'
import Appbar from './Appbar/Appbar'

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.appbar}>
        <Appbar />
      </div>
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.pagesContainer}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
