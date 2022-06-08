import React, { useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = React.createContext({})

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(false)

  return (
    <AuthContext.Provider value={{ user}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthContext)
  if (!auth) {
    throw Error('useAuth needs to be used inside AuthContext')
  }

  return auth
}