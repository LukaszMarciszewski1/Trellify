import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppProviders from './providers/AppProviders';
import Root from './views/Root';

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <Root />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root')
);
