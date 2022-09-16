import React from 'react'
import styles from './styles.module.scss'
import Sidebar from './Sidebar/Sidebar'
import AppBar from './AppBar/AppBar'
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'

const Layout: React.FC = () => {
  const { user } = useAuth()
  return (
    <>
      {user ? (
        <div className={styles.layout}>
          <AppBar />
          <div className={styles.content}>
            <Sidebar />
            <div className={styles.pagesContainer}>
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.authContainer}><Outlet /></div>
      )}
    </>
  )
}

export default Layout
