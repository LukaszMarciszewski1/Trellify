import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

const Auth: React.FC = () => {
  return (
    <Routes>
      <Route path='/logowanie' element={<SignIn />} />
      <Route path='/rejestracja' element={<SignUp />} />
      <Route path='/' element={<Navigate replace to='/logowanie' />} />
    </Routes>
  )
}

export default Auth