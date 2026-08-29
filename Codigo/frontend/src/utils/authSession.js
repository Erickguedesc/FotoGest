export const STALE_SESSION_ERROR_CODE = 'FOTOLHAR_STALE_SESSION'

export function normalizeAccountEmail(email = '') {
  return String(email || '').trim().toLowerCase()
}

export function getCurrentAuthSessionKey() {
  const token = localStorage.getItem('token') || ''

  if (token) return `token:${token}`

  const email = normalizeAccountEmail(localStorage.getItem('usuarioEmail') || '')
  return email ? `email:${email}` : 'anonymous'
}

export function isCurrentAuthSession(sessionKey) {
  return getCurrentAuthSessionKey() === sessionKey
}

export function createStaleSessionError() {
  const error = new Error('Resposta ignorada porque a sessão autenticada mudou.')
  error.code = STALE_SESSION_ERROR_CODE
  return error
}

export function isStaleSessionError(error) {
  return error?.code === STALE_SESSION_ERROR_CODE
}
