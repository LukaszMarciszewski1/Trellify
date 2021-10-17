import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './styles.module.scss'

const menuItems = [
  {
    name: 'Do zrobienia',
    path: '/',
  },
  {
    name: 'Zrobione',
    path: '/zrobione',
  },
  {
    name: 'Dodaj zadanie',
    path: '/dodaj-zadanie',
  },
]

const Sidebar:React.FC = () => {
  const location = useLocation()
  return (
    <nav className={styles.container}>
      <div className={styles.logo}><h1>TO DO</h1></div>
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
