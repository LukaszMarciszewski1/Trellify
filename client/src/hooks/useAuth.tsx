import React, { createContext, useContext, useState, useEffect } from 'react'
import  {User } from '../models/user'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const AuthContext = createContext<AuthContextData | null>(null)

type AuthContextData = ReturnType<typeof useProviderAuth>

export const useProviderAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token') || null;
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}users/me`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          setUser(data);
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [])

  const signIn = async ({ email, password }: User) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    }
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}users/login`,
        {
          email,
          password,
        },
        config
      )
      setLoading(false)
      setUser(data)
      localStorage.setItem('token', data.token)
    } catch (error: any) {
      setLoading(false)
      setError(error.response.data.message)
    }
  }

  const signUp = async ({ name, email, password }: User) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    }
    setLoading(true)
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}users`,
        {
          name,
          email,
          password,
        },
        config
      )
      setLoading(false)
      navigate('/logowanie')
    } catch (error: any) {
      setLoading(false)
      setError(error.response.data.message)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return { user, loading, error, signIn, signUp, signOut }
}

export const AuthProvider: React.FC = ({ children }) => {
  const value = useProviderAuth()

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth needs to be used inside AuthContext')
  }

  return auth
}