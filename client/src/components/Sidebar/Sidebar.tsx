import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './styles.module.scss'

const menuItems = [
  // {
  //   name: 'Home',
  //   path: '/',
  // },
  // {
  //   name: 'Zlecenia',
  //   path: '/',
  // },
  {
    name: 'Kalkulator',
    path: '/',
  },
  {
    name: 'Magazyn',
    path: '/View-2',
  },
  {
    name: 'Dostawcy',
    path: '/View-3',
  },
  {
    name: 'Informacje',
    path: '/View-4',
  },
]

const Sidebar:React.FC = () => {
  const location = useLocation()
  return (
    <nav className={styles.container}>
      <div className={styles.logo}><h1>LOGO</h1></div>
      <ul className={styles.listLinks}>
        {menuItems.map((item) => (
          <li key={item.name} 
          className={
            `${styles.navItem} ${location.pathname === item.path ? styles.active : styles.navItem}`
          }
          >
            <Link 
              to={item.path}
            >
              {item.name}
            </Link>
          </li>
          ))}
      </ul>
    </nav>
  )
}

export default Sidebar
