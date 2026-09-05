import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import LoadingState from './states/LoadingState'

export default function ProtectedRoute({ children }) {
  const { user, isCheckingSession } = useAuth()

  if (isCheckingSession) {
    return <LoadingState label="Checking your session..." />
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
