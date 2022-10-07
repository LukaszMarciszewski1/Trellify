import React from 'react'
import styles from './styles.module.scss'
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation/Navigation'
import Header from './Header/Header'

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.navigation}>
        <Navigation />
      </div>
      <div className={styles.pages}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
