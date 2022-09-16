import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import styles from './styles.module.scss'
import Layout from '../../components/Layout';
import Tasks from './TasksPage/TasksPage';
import Storage from './StoragePage/StoragePage';
import Statistics from './Statistics/Statistics';
import Information from './Settings/Settings';
import Calculator from './Calculator/Calculator';

const ErrorPage: React.FC = () => {
  return (
    <div><h1>page 404</h1></div>
  )
}

const Home: React.FC = () => {

  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/zadania" element={<Tasks />} />
        <Route path='/magazyn' element={<Storage />} />
        <Route path='/kalkulator' element={<Calculator />} />
        <Route path='/statystyki' element={<Statistics />} />
        <Route path='/ustawienia' element={<Information />} />
        <Route path="/" element={<Navigate replace to="/zadania" />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default Home
