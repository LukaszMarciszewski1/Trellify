import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

const Auth = () => {

  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  )
}

export default Auth