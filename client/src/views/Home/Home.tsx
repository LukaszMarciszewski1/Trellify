import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import styles from './styles.module.scss'

import AppBar from '../../components/AppBar/AppBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Layout from '../../components/Layout';
import Tasks from './TasksPage/TasksPage';
import Storage from './Storage/Storage';
import Statistics from './Statistics/Statistics';
import Information from './Information/Information';
import Calculator from './Calculator/Calculator';

const Home: React.FC = () => {

  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/board" element={<Tasks />} />
        <Route path='/calculator' element={<Calculator />} />
        <Route path='/storage' element={<Storage />} />
        <Route path='/statistics' element={<Statistics />} />
        <Route path='/information' element={<Information />} />
        <Route path="/" element={<Navigate replace to="/board" />} />
      </Route>
    </Routes>
  )
}

export default Home
