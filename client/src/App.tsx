import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Layout from './components/Layout';
import TasksPage from './views/TasksPage/TasksPage';
import Storage from './views/Storage/Storage';
import Statistics from './views/Statistics/Statistics';
import Information from './views/Information/Information';
import Calculator from './views/Calculator/Calculator';
import Login from './views/Auth/Login/Login';
import Signup from './views/Auth/Signup/Signup';
import './App.scss';

const App: React.FC = () => {

  const user = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {user && <Route element={<Layout />}>
          <Route path="/" element={<TasksPage />} />
          <Route path='/calculator' element={<Calculator />} />
          <Route path='/storage' element={<Storage />} />
          <Route path='/statistics' element={<Statistics />} />
          <Route path='/information' element={<Information />} />
        </Route>}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;