import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Auth from './Auth/Auth'
import Home from './Home/Home'

const Root = () => {
  const { user } = useAuth()

  return (
    <Routes>
      {user
        ? <Route path="/*" element={<Home />} />
        : <Route path="/*" element={<Auth />} />}
      <Route path='*' element={<Navigate to={user ? '/' : '/login'} />} />
    </Routes>
  )
}

export default Root