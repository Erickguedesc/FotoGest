import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { configuracoesService } from '../../services/configuracoesService'
import { isOnboardingComplete, syncOnboardingStatus } from '../../utils/onboarding'
import {
  getCurrentAuthSessionKey,
  isCurrentAuthSession,
  isStaleSessionError,
} from '../../utils/authSession'
import {
  getCachedOnboarding,
  setCachedOnboarding,
} from '../../utils/onboardingRouteCache'

export default function PrivateRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const sessionKey = getCurrentAuthSessionKey()
  const [loading, setLoading] = useState(Boolean(token))
  const [onboardingComplete, setOnboardingComplete] = useState(() => isOnboardingComplete())

  useEffect(() => {
    let active = true
    const effectSessionKey = sessionKey

    if (!token) {
      setLoading(false)
      return () => { active = false }
    }

    setLoading(true)

    const localOnboardingComplete = isOnboardingComplete()

    if (localOnboardingComplete) {
      setCachedOnboarding(effectSessionKey, true)
      setOnboardingComplete(true)
      setLoading(false)
      return () => { active = false }
    }

    const cachedOnboarding = getCachedOnboarding(effectSessionKey)

    if (cachedOnboarding !== null) {
      setOnboardingComplete(cachedOnboarding)
      setLoading(false)
      return () => { active = false }
    }

    configuracoesService.buscar()
      .then((data) => {
        if (!active || !isCurrentAuthSession(effectSessionKey)) return
        const complete = Boolean(data?.onboardingConcluido)
        setCachedOnboarding(effectSessionKey, complete)
        setOnboardingComplete(complete)
        syncOnboardingStatus(complete, data?.onboardingConcluidoEm)
      })
      .catch((error) => {
        if (!active || isStaleSessionError(error) || !isCurrentAuthSession(effectSessionKey)) return
        setOnboardingComplete(isOnboardingComplete())
      })
      .finally(() => {
        if (active && isCurrentAuthSession(effectSessionKey)) setLoading(false)
      })

    return () => { active = false }
  }, [token, location.pathname, sessionKey])

  if (!token) return <Navigate to="/login" replace />
  if (loading) return (
    <div className="theme-page flex min-h-screen items-center justify-center text-sm text-[var(--text-muted)]">
      Carregando
    </div>
  )
  if (!onboardingComplete && location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace state={{ from: location }} />
  if (onboardingComplete && location.pathname === '/onboarding') return <Navigate to="/dashboard" replace />

  return children
}
