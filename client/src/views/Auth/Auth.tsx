import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import Layout from '../../components/Layout';

const Auth: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path='/logowanie' element={<SignIn />} />
        <Route path='/rejestracja' element={<SignUp />} />
        <Route path='/' element={<Navigate replace to='/logowanie' />} />
      </Route>
    </Routes>
  )
}

export default Auth