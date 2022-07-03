import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import { store } from '../store/store';

const AppProviders: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default AppProviders