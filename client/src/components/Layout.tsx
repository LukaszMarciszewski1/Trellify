import React from 'react'
import styles from './styles.module.scss'
import Sidebar from './Nav/Sidebar/Sidebar'
import Appbar from './Appbar/Appbar'
import Notes from './Notes/Notes'


const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Appbar />
      <div className={styles.container}
          style={{
            // backgroundColor: backgroundUrl,
            // backgroundImage: `url("https://images.unsplash.com/photo-1515612148533-6247582c12c7?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMDMxMTR8MHwxfHNlYXJjaHw5Mnx8TGFuZHNjYXBlfGVufDB8fHx8MTY0NTIxOTk4MQ&ixlib=rb-1.2.1&q=85")`,
            // backgroundSize: 'cover',
            // backgroundRepeat: 'no-repeat',
            // backgroundPosition: 'center'
          }}
      >
        <Sidebar />
        <div className={styles.pagesContainer}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
