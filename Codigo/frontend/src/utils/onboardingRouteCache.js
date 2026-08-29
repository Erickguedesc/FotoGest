const CACHE_MS = 5000
const onboardingCache = new Map()

export function invalidateOnboardingRouteCache(sessionKey = null) {
  if (sessionKey) {
    onboardingCache.delete(sessionKey)
    return
  }

  onboardingCache.clear()
}

export function getCachedOnboarding(sessionKey) {
  const cached = onboardingCache.get(sessionKey)

  if (!cached || Date.now() - cached.cachedAt >= CACHE_MS) {
    onboardingCache.delete(sessionKey)
    return null
  }

  return cached.complete
}

export function setCachedOnboarding(sessionKey, complete) {
  onboardingCache.set(sessionKey, {
    complete,
    cachedAt: Date.now(),
  })
}
