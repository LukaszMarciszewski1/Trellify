import React from 'react'
import styles from './styles.module.scss'
import { Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth'
import Sidebar from './Navigation/Navigation'
import AppBar from './AppBar/AppBar'

const Layout: React.FC = () => {
  const { user } = useAuth()
  return (
    <>
      {user ? (
        <div className={styles.layout}>
          <div className={styles.appbar}>
            <AppBar />
          </div>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.pages}>
            <Outlet />
          </div>
        </div>
      ) : (
        <div className={styles.authContainer}><Outlet /></div>
      )}
    </>
  )
}

export default Layout
