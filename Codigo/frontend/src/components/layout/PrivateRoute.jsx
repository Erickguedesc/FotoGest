import { Navigate, useLocation } from 'react-router-dom'

import { isOnboardingComplete } from '../../utils/onboarding'

/**
 * PrivateRoute — protege rotas que exigem login.
 * Se não tiver token no localStorage, redireciona para /login.
 */
export default function PrivateRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isOnboardingComplete() && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace state={{ from: location }} />
  }

  return children
}
