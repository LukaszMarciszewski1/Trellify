import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './styles.module.scss'
import { MdArrowForwardIos } from "react-icons/md";
import { CgCalculator } from "react-icons/cg";
import { GiDeliveryDrone } from "react-icons/gi";
import { FiSettings } from "react-icons/fi";
import { GrTask } from "react-icons/gr";
import { BiCategory } from 'react-icons/bi'

const menuItems = [
  {
    name: 'Zadania',
    path: '/zadania',
    icon: <GrTask />
  },
  {
    name: 'Magazyn',
    path: '/magazyn',
    icon: <BiCategory />
  },
  {
    name: 'Ustawienia',
    path: '/ustawienia',
    icon: <FiSettings />
  },
]

const Nav: React.FC = () => {
  const location = useLocation()
  const [isSidebarOpen, setISSidebarOpen] = useState(true)

  return (
    <nav className={`${styles.nav} ${isSidebarOpen ? styles.navHidden : styles.nav}`}>
      <button
        className={`${styles.switchButton} ${isSidebarOpen ? styles.switchButton : styles.switchButtonHidden}`}
        onClick={() => setISSidebarOpen((p) => !p)}>
        <MdArrowForwardIos />
      </button>
      <ul className={styles.linksContainer}>
        {menuItems.map((item) => (
          <li key={item.name}
            className={styles.navItem}
          >
            <Link
              to={item.path}
            >
              <div className={`${styles.navLink} ${location.pathname === item.path ? styles.active : styles.navLink}`}>
                <div className={styles.icon} title={item.name}>{item.icon}</div>
                <span>{!isSidebarOpen ? item.name : null}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.divider} />
    </nav>
  )
}

export default Nav
