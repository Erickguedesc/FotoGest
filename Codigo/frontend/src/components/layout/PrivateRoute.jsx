import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { configuracoesService } from '../../services/configuracoesService'
import { isOnboardingComplete, syncOnboardingStatus } from '../../utils/onboarding'

// fora do componente — persiste entre renders
const CACHE_MS = 5000
let cachedOnboarding = null
let cachedAt = 0

export default function PrivateRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(Boolean(token))
  const [onboardingComplete, setOnboardingComplete] = useState(() => isOnboardingComplete())

  useEffect(() => {
    let active = true

    if (!token) {
      setLoading(false)
      return () => { active = false }
    }

    setLoading(true)

    const now = Date.now()
    const localOnboardingComplete = isOnboardingComplete()

    if (localOnboardingComplete) {
      cachedOnboarding = true
      cachedAt = now
      setOnboardingComplete(true)
      setLoading(false)
      return () => { active = false }
    }

    if (cachedOnboarding !== null && now - cachedAt < CACHE_MS) {
      setOnboardingComplete(cachedOnboarding)
      setLoading(false)
      return () => { active = false }
    }

    configuracoesService.buscar()
      .then((data) => {
        if (!active) return
        const complete = Boolean(data?.onboardingConcluido)
        cachedOnboarding = complete
        cachedAt = Date.now()
        setOnboardingComplete(complete)
        syncOnboardingStatus(complete, data?.onboardingConcluidoEm)
      })
      .catch(() => {
        if (!active) return
        setOnboardingComplete(isOnboardingComplete())
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [token, location.pathname])

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
