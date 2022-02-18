import React from 'react'
import styles from './styles.module.scss'
import Sidebar from './Nav/Sidebar/Sidebar'
import Appbar from './Appbar/Appbar'
import Notes from './Notes/Notes'


const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Appbar />
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.pagesContainer}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
