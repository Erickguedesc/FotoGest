import { getCurrentAuthSessionKey, normalizeAccountEmail } from './authSession'
import { normalizarEstadoUf } from './brasil'

const STORAGE_PREFIX = 'fotolhar:ultimo-estado-ensaio'

function getStorageKey() {
  const email = normalizeAccountEmail(localStorage.getItem('usuarioEmail') || '')
  const usuario = email || getCurrentAuthSessionKey()

  return `${STORAGE_PREFIX}:${usuario}`
}

export function getUltimoEstadoEnsaio() {
  try {
    return normalizarEstadoUf(localStorage.getItem(getStorageKey()) || '')
  } catch {
    return ''
  }
}

export function salvarUltimoEstadoEnsaio(value) {
  const uf = normalizarEstadoUf(value)
  if (!uf) return

  try {
    localStorage.setItem(getStorageKey(), uf)
  } catch {
    // A preferência é apenas conveniência; o cadastro continua funcionando sem localStorage.
  }
}
