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
      <div className={styles.logo}></div>
      <ul className={styles.listLinks}>
        {menuItems.map((item) => (
          <li key={item.name} className={styles.navItem}>
            <Link 
              to={item.path}
              className={
                location.pathname === item.path ? "active" : ''
              }
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
