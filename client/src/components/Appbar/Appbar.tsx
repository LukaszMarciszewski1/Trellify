import React, { useState } from 'react'
import styles from './styles.module.scss'
import Button from '../Details/Button/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Popup from '../Details/Popup/Popup'

const AppBar: React.FC = () => {
  let navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [popupTrigger, setPopupTrigger] = useState(false)

  const sygnature = user?.name.charAt(0)

  return (
    <div className={styles.container}>
      <div className={styles.userAction}>
        <button onClick={() => setPopupTrigger(true)} className={styles.userActionBtn}>
          <h3>{sygnature}</h3>
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
          <div className={styles.userActionBtn}>{sygnature}</div>
          <Button
            title={'Wyloguj'}
            onClick={() => {
              navigate("/login")
              signOut()
            }}
            type={'button'} />
        </Popup>
      </div>
    </div>
  )
}

export default AppBar
