import React, { useState } from 'react'
import styles from './styles.module.scss'
import { useAuth } from 'hooks/useAuth'
import Popup from 'components/common/Popup/Popup'
import Button from 'components/common/Button/Button'
import logoSrc from 'assets/img/trellify-white.svg'

const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const [popupTrigger, setPopupTrigger] = useState(false)
  const signature = user ? user.name.charAt(0) : ''

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logoSrc} alt='logo' />
      </div>
      <div className={styles.userAction}>
        <button onClick={() => setPopupTrigger(true)} className={styles.userActionBtn}>
          <h3>{signature}</h3>
        </button>
        <Popup
          title={'Konto'}
          trigger={popupTrigger}
          closePopup={() => {
            setPopupTrigger(false)
          }}
          top={'55px'}
          right={'5px'}
        >
          <div className={styles.userInfo}>
            <div className={styles.userSignature}><h3>{signature}</h3></div>
            <div>
              <p>{user?.name}</p>
              <span>{user?.email}</span>
            </div>
          </div>
          <Button
            title={'Wyloguj'}
            onClick={signOut}
            type={'button'}
          />
        </Popup>
      </div>
    </div>
  )
}

export default Header
