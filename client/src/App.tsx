import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth'
import Layout from 'components/Layout';
import SignIn from 'components/Auth/SignIn/SignIn';
import SignUp from 'components/Auth/SignUp/SignUp';
import Tasks from 'pages/TasksPage';
import Storage from 'pages/StoragePage';
import Calculator from 'pages/CalculatorPage';
import Statistics from 'pages/StatisticsPage';
import Settings from 'pages/SettingsPage';

const App: React.FC = () => {
  const { user } = useAuth()

  return (
    <>
      <Routes>
        {user ? (
          <Route element={<Layout />} >
            <Route path="/zadania" element={<Tasks />} />
            <Route path='/magazyn' element={<Storage />} />
            <Route path='/kalkulator' element={<Calculator />} />
            <Route path='/statystyki' element={<Statistics />} />
            <Route path='/ustawienia' element={<Settings />} />
            <Route path="/*" element={<Navigate replace to="/zadania" />} />
          </Route>
        ) : (
          <>
            <Route path='/logowanie' element={<SignIn />} />
            <Route path='/rejestracja' element={<SignUp />} />
            <Route path='/*' element={<Navigate replace to='/logowanie' />} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App