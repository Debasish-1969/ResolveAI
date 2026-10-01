import { createContext, useEffect, useState } from 'react'
import { login as loginRequest } from '../services/authService.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('resolveai_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem('resolveai_token')

      if (!savedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Session expired')
        }

        setUser(data.user)
        setToken(savedToken)
      } catch (error) {
        localStorage.removeItem('resolveai_token')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  async function login(email, password, loginAs) {
    setLoading(true)

    try {
      const data = await loginRequest(email, password, loginAs)

      localStorage.setItem('resolveai_token', data.token)

      setUser(data.user)
      setToken(data.token)

      return data
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('resolveai_token')
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}