import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import { useAuth } from '../../hooks/useAuth'
import Layout from '../../components/Layout';

const ErrorPage: React.FC = () => {
  return (
    <div>
      <h1>404</h1>
      <h2>Page not found</h2>
    </div>
  )
}

const Auth = () => {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path='/logowanie' element={<SignIn />} />
        <Route path='/rejestracja' element={<SignUp />} />
        <Route path='/' element={<Navigate replace to='/logowanie' />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default Auth