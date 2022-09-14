import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './styles.module.scss'

import { MdArrowForwardIos } from "react-icons/md";
import { CgCalculator } from "react-icons/cg";
import { GiDeliveryDrone } from "react-icons/gi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoLogoJavascript } from "react-icons/io";
import { CgComponents } from "react-icons/cg";
import { GrTask } from "react-icons/gr";

import { defaultBackground } from '../../components/Tasks/localData'


import { useCreateBoardMutation } from '../../store/api/boards'

const menuItems = [
  {
    name: 'Zadania',
    path: '/zadania',
    icon: <GrTask />
  },
  {
    name: 'Magazyn',
    path: '/magazyn',
    icon: <CgComponents />
  },
  {
    name: 'Kalkulator',
    path: '/kalkulator',
    icon: <CgCalculator />
  },
  {
    name: 'Statystyki',
    path: '/statystyki',
    icon: <GiDeliveryDrone />
  },
  {
    name: 'Ustawienia',
    path: '/ustawienia',
    icon: <AiOutlineInfoCircle />
  },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [isSidebarOpen, setISSidebarOpen] = useState(true)

  return (
    <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarHidden : styles.sidebar}`}>
      <button
        className={`${styles.navButton} ${isSidebarOpen ? styles.navButton : styles.navButtonHidden}`}
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
                <div className={styles.icon}>{item.icon}</div>
                <p>{!isSidebarOpen ? item.name : null}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.divider} />
    </nav>
  )
}

export default Sidebar
