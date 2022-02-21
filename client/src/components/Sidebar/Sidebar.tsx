import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './styles.module.scss'

import { MdArrowForwardIos } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { CgCalculator } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
import { GiDeliveryDrone } from "react-icons/gi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoLogoJavascript } from "react-icons/io";
import { CgComponents } from "react-icons/cg";
import { GrTask } from "react-icons/gr";

const menuItems = [
  {
    name: 'Zadania',
    path: '/',
    icon: <GrTask />
  },
  {
    name: 'Kalkulator',
    path: '/calculator',
    icon: <CgCalculator />
  },
  {
    name: 'Materiały',
    path: '/View-2',
    icon: <CgComponents />
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <nav
      // className={styles.container}
      className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarHide : styles.sidebar}`}
    >
      <button
        className={`${styles.navButton} ${sidebarOpen ? styles.navButton : styles.navButtonHide}`}
        onClick={() => setSidebarOpen((p) => !p)}>
        <MdArrowForwardIos />
      </button>
      <div className={styles.logo}><IoLogoJavascript /></div>
      <ul className={styles.linksContainer}>
        {menuItems.map((item) => (
          <li key={item.name}
            className={styles.navItem}
          >
            <Link
              to={item.path}
            >
              <div className={`${styles.navLink} ${location.pathname === item.path ? styles.active : styles.navLink}`}>
                <div className={styles.icon}>{item.icon}</div>
                <p>{!sidebarOpen ? item.name : null}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
