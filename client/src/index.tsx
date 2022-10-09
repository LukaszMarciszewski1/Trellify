import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/styles/base.scss';
import AppProviders from './providers/AppProviders';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root')
);
