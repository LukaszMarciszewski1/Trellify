import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
     {/* <AuthProvider> */}
       <App />
      {/* </AuthProvider> */}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
