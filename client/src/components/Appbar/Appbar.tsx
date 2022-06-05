import React from 'react'
import styles from './styles.module.scss'
import Button from '../Details/Button/Button'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

const Appbar: React.FC = () => {
  let navigate = useNavigate()
  const auth = useAuth()
  return (
    <div className={styles.container}>
      <Button
        title={'Wyloguj'}
        onClick={() => {
          localStorage.removeItem('token')
          navigate("/login")
        }}
        type={'button'} />
    </div>
  )
}

export default Appbar
