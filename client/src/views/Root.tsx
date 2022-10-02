import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth'
import Auth from 'views/Auth/Auth'
import Home from 'views/Home/Home'

const Root: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    user ? navigate('/') : navigate('/logowanie')
  }, [user])

  return (
    <>
      <Routes>
        {user ? <Route path="/*" element={<Home />} /> : <Route path="/*" element={<Auth />} />}
      </Routes>
    </>
  )
}

export default Root