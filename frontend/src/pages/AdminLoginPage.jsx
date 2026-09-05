import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { apiErrorMessage } from '../api'

export default function AdminLoginPage() {
  const { user, login, isCheckingSession } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isCheckingSession && user) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setError('')

    try {
      const loggedInUser = await login(email, password)

      if (loggedInUser) {
        navigate('/admin')
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (submitError) {
      setError(apiErrorMessage(submitError, 'Invalid email or password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="container auth-container">
        <h1>Admin Login</h1>
        <p className="auth-subtitle">Sign in to manage portfolio projects.</p>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-field">
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

          <div className="form-field">
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

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
