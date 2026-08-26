import api from './api'

const CONFIG_CACHE_MS = 60 * 1000

let configuracoesCache = null
let configuracoesCacheAt = 0
let configuracoesRequest = null

function invalidateCache() {
  configuracoesCache = null
  configuracoesCacheAt = 0
  configuracoesRequest = null
}

function setCache(data) {
  configuracoesCache = data
  configuracoesCacheAt = Date.now()
  return data
}

export const configuracoesService = {
  invalidateCache,

  buscar: async ({ force = false } = {}) => {
    const cacheValido =
      configuracoesCache &&
      Date.now() - configuracoesCacheAt < CONFIG_CACHE_MS

    if (!force && cacheValido) {
      return configuracoesCache
    }

    if (!force && configuracoesRequest) {
      return configuracoesRequest
    }

    configuracoesRequest = api.get('/configuracoes')
      .then((response) => setCache(response.data))
      .finally(() => {
        configuracoesRequest = null
      })

    return configuracoesRequest
  },

  concluirOnboarding: async () => {
    const response = await api.post('/configuracoes/onboarding/concluir')
    invalidateCache()
    return response.data
  },

  atualizarUsuario: async (dados) => {
    const response = await api.put('/configuracoes/usuario', dados)
    invalidateCache()
    return response.data
  },

  uploadFotoPerfil: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const response = await api.patch('/configuracoes/usuario/foto', formData)

    invalidateCache()
    return response.data
  },

  atualizarEstudio: async (dados) => {
    const response = await api.put('/configuracoes/estudio', dados)
    invalidateCache()
    return response.data
  },

  uploadLogoEstudio: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const response = await api.patch('/configuracoes/estudio/logo', formData)

    invalidateCache()
    return response.data
  },

  buscarMarcaDagua: async () => {
    const response = await api.get('/configuracoes/marca-dagua')
    return response.data
  },

  atualizarMarcaDagua: async (dados) => {
    const response = await api.put('/configuracoes/marca-dagua', dados)
    invalidateCache()
    return response.data
  },

  uploadMarcaDagua: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const response = await api.patch('/configuracoes/marca-dagua/imagem', formData)

    invalidateCache()
    return response.data
  },

  removerMarcaDagua: async () => {
    const response = await api.delete('/configuracoes/marca-dagua/imagem')
    invalidateCache()
    return response.data
  },

  reprocessarMarcaDagua: async () => {
    const response = await api.post('/configuracoes/marca-dagua/reprocessar')
    invalidateCache()
    return response.data
  },

  atualizarPreferencias: async (dados) => {
    const response = await api.put('/configuracoes/preferencias', dados)
    invalidateCache()
    return response.data
  },

  atualizarEmail: async (dados) => {
    const response = await api.put('/configuracoes/email', dados)
    invalidateCache()
    return response.data
  },

  enviarEmailTeste: async () => {
    const response = await api.post('/configuracoes/email/teste')
    invalidateCache()
    return response.data
  },

  listarModelosContrato: async () => {
    const response = await api.get('/configuracoes/modelos-contrato')
    return response.data
  },

  criarModeloContrato: async (dados) => {
    const response = await api.post('/configuracoes/modelos-contrato', dados)
    invalidateCache()
    return response.data
  },

  atualizarModeloContrato: async (id, dados) => {
    const response = await api.put(`/configuracoes/modelos-contrato/${id}`, dados)
    invalidateCache()
    return response.data
  },

  removerModeloContrato: async (id) => {
    await api.delete(`/configuracoes/modelos-contrato/${id}`)
    invalidateCache()
  },

  uploadCapaAlbumPadrao: async (arquivo) => {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  const response = await api.patch('/configuracoes/preferencias/capa-album', formData)

  invalidateCache()
  return response.data
},

  alterarSenha: async (dados) => {
    const response = await api.patch('/configuracoes/senha', dados)
    invalidateCache()
    return response.data
  },

  gerarBackupMetadados: async () => {
    const response = await api.post('/configuracoes/backup/metadados', null, {
      responseType: 'blob',
    })
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
  const response = await api.post('/configuracoes/marca-dagua/texto', dados)
  invalidateCache()
  return response.data
},
}
