import React from 'react'
import styles from './styles.module.scss'
import Sidebar from './Sidebar/Sidebar'
import AppBar from './AppBar/AppBar'
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
        <AppBar />
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.pagesContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
