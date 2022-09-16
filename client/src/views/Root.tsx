import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import Auth from './Auth/Auth'
import Home from './Home/Home'
import { useEffect } from 'react';

const Root: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])

  console.log(user)

  return (
    <>
      <Routes>
        {user ? <Route path="/*" element={<Home />} /> : <Route path="/*" element={<Auth />} />}
      </Routes>
    </>
  )
}

export default Root