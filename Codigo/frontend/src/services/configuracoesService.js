import api from './api'
import {
  createStaleSessionError,
  getCurrentAuthSessionKey,
  isCurrentAuthSession,
} from '../utils/authSession'

const CONFIG_CACHE_MS = 60 * 1000

let configuracoesCache = null
let configuracoesCacheAt = 0
let configuracoesCacheSessionKey = null
let configuracoesRequest = null
let configuracoesRequestSessionKey = null

function invalidateCache(sessionKey = null) {
  if (!sessionKey || configuracoesCacheSessionKey === sessionKey) {
    configuracoesCache = null
    configuracoesCacheAt = 0
    configuracoesCacheSessionKey = null
  }

  if (!sessionKey || configuracoesRequestSessionKey === sessionKey) {
    configuracoesRequest = null
    configuracoesRequestSessionKey = null
  }
}

function invalidateAllUserCaches() {
  invalidateCache()
}

function assertCurrentSession(sessionKey) {
  if (!isCurrentAuthSession(sessionKey)) {
    throw createStaleSessionError()
  }
}

function setCache(data, sessionKey) {
  assertCurrentSession(sessionKey)
  configuracoesCache = data
  configuracoesCacheAt = Date.now()
  configuracoesCacheSessionKey = sessionKey
  return data
}

async function guardedRequest(requestFactory, { invalidate = false } = {}) {
  const sessionKey = getCurrentAuthSessionKey()
  const response = await requestFactory()

  assertCurrentSession(sessionKey)

  if (invalidate) {
    invalidateCache(sessionKey)
  }

  return response.data
}

function clearRequestIfCurrent(requestSessionKey) {
  if (configuracoesRequestSessionKey === requestSessionKey) {
    configuracoesRequest = null
    configuracoesRequestSessionKey = null
  }
}

export const configuracoesService = {
  invalidateCache,
  invalidateAllUserCaches,

  buscar: async ({ force = false } = {}) => {
    const sessionKey = getCurrentAuthSessionKey()
    const cacheValido =
      configuracoesCache &&
      configuracoesCacheSessionKey === sessionKey &&
      Date.now() - configuracoesCacheAt < CONFIG_CACHE_MS

    if (!force && cacheValido) {
      return configuracoesCache
    }

    if (!force && configuracoesRequest && configuracoesRequestSessionKey === sessionKey) {
      return configuracoesRequest
    }

    const requestSessionKey = sessionKey
    configuracoesRequestSessionKey = requestSessionKey
    configuracoesRequest = api.get('/configuracoes')
      .then((response) => setCache(response.data, requestSessionKey))
      .finally(() => {
        clearRequestIfCurrent(requestSessionKey)
      })

    return configuracoesRequest
  },

  concluirOnboarding: async () => {
    return guardedRequest(
      () => api.post('/configuracoes/onboarding/concluir'),
      { invalidate: true },
    )
  },

  atualizarUsuario: async (dados) => {
    return guardedRequest(
      () => api.put('/configuracoes/usuario', dados),
      { invalidate: true },
    )
  },

  uploadFotoPerfil: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    return guardedRequest(
      () => api.patch('/configuracoes/usuario/foto', formData),
      { invalidate: true },
    )
  },

  atualizarEstudio: async (dados) => {
    return guardedRequest(
      () => api.put('/configuracoes/estudio', dados),
      { invalidate: true },
    )
  },

  uploadLogoEstudio: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    return guardedRequest(
      () => api.patch('/configuracoes/estudio/logo', formData),
      { invalidate: true },
    )
  },

  buscarMarcaDagua: async () => {
    return guardedRequest(() => api.get('/configuracoes/marca-dagua'))
  },

  atualizarMarcaDagua: async (dados) => {
    return guardedRequest(
      () => api.put('/configuracoes/marca-dagua', dados),
      { invalidate: true },
    )
  },

  uploadMarcaDagua: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    return guardedRequest(
      () => api.patch('/configuracoes/marca-dagua/imagem', formData),
      { invalidate: true },
    )
  },

  removerMarcaDagua: async () => {
    return guardedRequest(
      () => api.delete('/configuracoes/marca-dagua/imagem'),
      { invalidate: true },
    )
  },

  reprocessarMarcaDagua: async () => {
    return guardedRequest(
      () => api.post('/configuracoes/marca-dagua/reprocessar'),
      { invalidate: true },
    )
  },

  atualizarPreferencias: async (dados) => {
    return guardedRequest(
      () => api.put('/configuracoes/preferencias', dados),
      { invalidate: true },
    )
  },

  atualizarEmail: async (dados) => {
    return guardedRequest(
      () => api.put('/configuracoes/email', dados),
      { invalidate: true },
    )
  },

  enviarEmailTeste: async () => {
    return guardedRequest(
      () => api.post('/configuracoes/email/teste'),
      { invalidate: true },
    )
  },

  listarModelosContrato: async () => {
    return guardedRequest(() => api.get('/configuracoes/modelos-contrato'))
  },

  criarModeloContrato: async (dados) => {
    return guardedRequest(
      () => api.post('/configuracoes/modelos-contrato', dados),
      { invalidate: true },
    )
  },

  atualizarModeloContrato: async (id, dados) => {
    return guardedRequest(
      () => api.put(`/configuracoes/modelos-contrato/${id}`, dados),
      { invalidate: true },
    )
  },

  removerModeloContrato: async (id) => {
    await guardedRequest(
      () => api.delete(`/configuracoes/modelos-contrato/${id}`),
      { invalidate: true },
    )
  },

  uploadCapaAlbumPadrao: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    return guardedRequest(
      () => api.patch('/configuracoes/preferencias/capa-album', formData),
      { invalidate: true },
    )
  },

  alterarSenha: async (dados) => {
    return guardedRequest(
      () => api.patch('/configuracoes/senha', dados),
      { invalidate: true },
    )
  },

  gerarBackupMetadados: async () => {
    const sessionKey = getCurrentAuthSessionKey()
    const response = await api.post('/configuracoes/backup/metadados', null, {
      responseType: 'blob',
    })

    assertCurrentSession(sessionKey)

    const agora = new Date().toISOString()
    const nomeArquivo = `fotolhar-backup-${agora.slice(0, 10)}.zip`
    const blob = new Blob([response.data], {
      type: 'application/zip',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = nomeArquivo
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return { geradoEm: agora }
  },

  gerarMarcaDaguaTexto: async (dados) => {
    return guardedRequest(
      () => api.post('/configuracoes/marca-dagua/texto', dados),
      { invalidate: true },
    )
  },
}
