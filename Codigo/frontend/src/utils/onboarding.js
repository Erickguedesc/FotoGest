import { normalizeAccountEmail } from './authSession'

const ONBOARDING_PREFIX = 'fotolhar:onboarding'
const ONBOARDING_ACCOUNT_SUFFIXES = ['complete', 'completedAt', 'demoEnsaioId']

function getAccountKey() {
  const email = localStorage.getItem('usuarioEmail')
  return normalizeAccountEmail(email || 'default')
}

function getOnboardingKeyForAccount(email, suffix) {
  return `${ONBOARDING_PREFIX}:${normalizeAccountEmail(email || 'default')}:${suffix}`
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

export function migrateOnboardingAccountKeys(previousEmail, nextEmail, status = {}) {
  const previousAccount = normalizeAccountEmail(previousEmail)
  const nextAccount = normalizeAccountEmail(nextEmail)

  if (!previousAccount || !nextAccount || previousAccount === nextAccount) {
    return
  }

  const hasBackendStatus = typeof status.onboardingConcluido === 'boolean'

  if (!hasBackendStatus) {
    ONBOARDING_ACCOUNT_SUFFIXES.forEach((suffix) => {
      const previousKey = getOnboardingKeyForAccount(previousAccount, suffix)
      const nextKey = getOnboardingKeyForAccount(nextAccount, suffix)
      const previousValue = localStorage.getItem(previousKey)

      if (previousValue !== null && localStorage.getItem(nextKey) === null) {
        localStorage.setItem(nextKey, previousValue)
      }
    })
  }

  if (status.onboardingConcluido === true) {
    localStorage.setItem(getOnboardingKeyForAccount(nextAccount, 'complete'), 'true')
    if (status.onboardingConcluidoEm) {
      localStorage.setItem(getOnboardingKeyForAccount(nextAccount, 'completedAt'), status.onboardingConcluidoEm)
    }
  } else if (status.onboardingConcluido === false) {
    localStorage.removeItem(getOnboardingKeyForAccount(nextAccount, 'complete'))
    localStorage.removeItem(getOnboardingKeyForAccount(nextAccount, 'completedAt'))
  }

  const previousDemoId = localStorage.getItem(getOnboardingKeyForAccount(previousAccount, 'demoEnsaioId'))
  const nextDemoKey = getOnboardingKeyForAccount(nextAccount, 'demoEnsaioId')

  if (previousDemoId !== null && localStorage.getItem(nextDemoKey) === null) {
    localStorage.setItem(nextDemoKey, previousDemoId)
  }
}
