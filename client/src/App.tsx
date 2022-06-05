import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Layout from './components/Layout';
import TasksPage from './views/TasksPage/TasksPage';
import View2 from './views/View2/View2';
import View3 from './views/View3/View3';
import View4 from './views/View4/View4';
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
            <Route path='/View-2' element={<View2 />} />
            <Route path='/View-3' element={<View3 />} />
            <Route path='/View-4' element={<View4 />} />
          </Route>}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;