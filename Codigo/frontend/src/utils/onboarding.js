const ONBOARDING_PREFIX = 'fotogest:onboarding'

function getAccountKey() {
  const email = localStorage.getItem('fotografaEmail')
  return (email || 'default').trim().toLowerCase()
}

export function getOnboardingKey(suffix) {
  return `${ONBOARDING_PREFIX}:${getAccountKey()}:${suffix}`
}

export function isOnboardingComplete() {
  return localStorage.getItem(getOnboardingKey('complete')) === 'true'
}

export function completeOnboarding() {
  localStorage.setItem(getOnboardingKey('complete'), 'true')
  localStorage.setItem(getOnboardingKey('completedAt'), new Date().toISOString())
}

export function getDemoEnsaioId() {
  return localStorage.getItem(getOnboardingKey('demoEnsaioId'))
}

export function setDemoEnsaioId(id) {
  if (id) {
    localStorage.setItem(getOnboardingKey('demoEnsaioId'), id)
  }
}

export function getPreservedOnboardingEntries() {
  return Object.entries(localStorage).filter(([key]) => key.startsWith(`${ONBOARDING_PREFIX}:`))
}
