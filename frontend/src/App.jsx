import { useEffect, useState } from 'react'
import api from './api'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await api.get('/api/user')

        setUser(response.data.user)
      } catch {
        setUser(null)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  async function handleLogin(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setMessage('')

    try {
      await api.get('/sanctum/csrf-cookie')

      await api.post('/login', {
        email,
        password,
      })

      const response = await api.get('/api/user')

      setUser(response.data.user)
      setPassword('')
      setMessage('Login successful.')
    } catch (error) {
      setUser(null)
      setMessage(error.response?.data?.message || 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

    async function handleLogout() {
    setIsLoggingOut(true)
    setMessage('')

    try {
      await api.post('/logout')

      setUser(null)
      setEmail('')
      setPassword('')
      setMessage('You have been logged out.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Logout failed.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isCheckingSession) {
    return (
      <main>
        <p>Checking session...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Portfolio Admin Login</h1>

      {user ? (
        <section>
  <p>Welcome, {user.name}.</p>
  <p>{message}</p>

  <button
    type="button"
    onClick={handleLogout}
    disabled={isLoggingOut}
  >
    {isLoggingOut ? 'Logging out...' : 'Log out'}
  </button>
</section>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          {message && <p>{message}</p>}
        </form>
      )}
    </main>
  )
}

export default App