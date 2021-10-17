import React from 'react'
import styles from './styles.module.scss'
import Sidebar from './Sidebar/Sidebar'
import Topbar from './Topbar/Topbar'
import History from './History/History'

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.topbarContainer}>
        <Topbar />
      </div>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.pagesContainer}>{children}</div>
      <div className={styles.historyContainer}>
        <History />
      </div>
    </div>
  )
}

export default Layout
