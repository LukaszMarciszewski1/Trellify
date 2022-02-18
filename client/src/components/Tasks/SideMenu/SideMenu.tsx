import React, { useState } from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SideMenuData } from './SideMenuData';
import styles from './styles.module.scss'

import { IconContext } from 'react-icons';
const SideMenu = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
    <IconContext.Provider value={{ color: '#fff' }}>
      <div className={styles.navbar}>
        <Link to='#' className={styles.menuBars}>
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? styles.active : styles.navMenu}>
        <ul className={styles.navMenuItem} onClick={showSidebar}>
          <li className={styles.navbarToggle}>
            <Link to='#' className={styles.menuBar}>
              <AiIcons.AiOutlineClose />
            </Link>
          </li>
          {SideMenuData.map((item, index) => {
            return (
              <li key={index} className={styles.cName}>
                <Link to={item.path}>
                  {/* {item.icon} */}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </IconContext.Provider>
  </>
  )
}

export default SideMenu