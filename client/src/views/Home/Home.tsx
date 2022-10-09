import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Tasks from './TasksPage';
import Storage from './StoragePage';
import Statistics from './Statistics';
import Settings from './Settings';
import Calculator from './Calculator';
import Layout from 'components/Layout';

const Home: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/zadania" element={<Tasks />} />
        <Route path='/magazyn' element={<Storage />} />
        <Route path='/kalkulator' element={<Calculator />} />
        <Route path='/statystyki' element={<Statistics />} />
        <Route path='/ustawienia' element={<Settings />} />
        <Route path="/" element={<Navigate replace to="/zadania" />} />
      </Route>
    </Routes>
  )
}

export default Home
