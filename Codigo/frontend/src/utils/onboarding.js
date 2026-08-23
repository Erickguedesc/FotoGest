const ONBOARDING_PREFIX = 'fotolhar:onboarding'

function getAccountKey() {
  const email = localStorage.getItem('usuarioEmail')
  return (email || 'default').trim().toLowerCase()
}

export function getOnboardingKey(suffix) {
  return `${ONBOARDING_PREFIX}:${getAccountKey()}:${suffix}`
}

export function isOnboardingComplete() {
  return localStorage.getItem(getOnboardingKey('complete')) === 'true'
}

export function completeOnboarding(completedAt = new Date().toISOString()) {
  localStorage.setItem(getOnboardingKey('complete'), 'true')
  localStorage.setItem(getOnboardingKey('completedAt'), completedAt)
}

export function resetOnboardingComplete() {
  localStorage.removeItem(getOnboardingKey('complete'))
  localStorage.removeItem(getOnboardingKey('completedAt'))
}

export function syncOnboardingStatus(complete, completedAt) {
  if (complete) {
    completeOnboarding(completedAt || new Date().toISOString())
    return
  }

  resetOnboardingComplete()
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
