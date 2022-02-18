import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './styles.module.scss'

import { MdArrowForwardIos } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { CgCalculator } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
import { GiDeliveryDrone } from "react-icons/gi";
import { AiOutlineInfoCircle } from "react-icons/ai";

const menuItems = [
  {
    name: 'Zadania',
    path: '/',
    icon: <AiOutlineHome />
  },
  {
    name: 'Magazyn',
    path: '/View-2',
    icon: <CgCalculator />
  },
  {
    name: 'Dostawcy',
    path: '/View-3',
    icon: <GiDeliveryDrone />
  },
  {
    name: 'Informacje',
    path: '/View-4',
    icon: <AiOutlineInfoCircle />
  },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  return (
    <nav className={styles.container}>
      <button className={styles.navButton}><MdArrowForwardIos /></button>
      <div className={styles.logo}><h1>LOGO</h1></div>
      <ul className={styles.linksContainer}>
        {menuItems.map((item) => (
          <li key={item.name}
            className={styles.navItem}
          >
            <Link
              to={item.path}
            >
              <div className={`${styles.navLink} ${location.pathname === item.path ? styles.active : styles.navLink}`}>
                <div className={styles.icon}> {item.icon}</div>
                {item.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
