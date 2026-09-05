import { useCallback, useEffect, useState } from 'react'
import api from '../api'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const response = await api.get('/api/user')
      setUser(response.data.user)
      return response.data.user
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    async function checkSession() {
      await refreshSession()
      setIsCheckingSession(false)
    }

    checkSession()
  }, [refreshSession])

  async function login(email, password) {
    await api.get('/sanctum/csrf-cookie')
    await api.post('/login', { email, password })
    return refreshSession()
  }

  async function logout() {
    await api.post('/logout')
    setUser(null)
  }

  const value = { user, isCheckingSession, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
