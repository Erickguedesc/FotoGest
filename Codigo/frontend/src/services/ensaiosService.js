import api from './api'

const LIST_CACHE_PREFIX = 'fotolhar:ensaios:list'
const LIST_CACHE_MAX_AGE_MS = 30 * 60 * 1000
const memoryListCache = new Map()
const pendingListRequests = new Map()

function getAccountCacheKey() {
  return (localStorage.getItem('usuarioEmail') || 'anonimo').trim().toLowerCase()
}

function normalizeParams(params = {}) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
}

function getListCacheKey(params = {}) {
  return `${LIST_CACHE_PREFIX}:${getAccountCacheKey()}:${JSON.stringify(normalizeParams(params))}`
}

function readStoredListCache(key) {
  try {
    const cached = window.sessionStorage.getItem(key)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

function writeListCache(key, data) {
  const entry = {
    data,
    timestamp: Date.now(),
  }

  memoryListCache.set(key, entry)

  try {
    window.sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // O cache é só uma otimização visual; se o navegador bloquear, a tela segue buscando da API.
  }
}

function readListCache(params = {}) {
  const key = getListCacheKey(params)
  const entry = memoryListCache.get(key) || readStoredListCache(key)

  if (!entry || !Array.isArray(entry.data)) return null
  if (Date.now() - Number(entry.timestamp || 0) > LIST_CACHE_MAX_AGE_MS) return null

  memoryListCache.set(key, entry)
  return entry.data
}

function invalidateListCache() {
  memoryListCache.clear()
  pendingListRequests.clear()

  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(LIST_CACHE_PREFIX))
      .forEach((key) => window.sessionStorage.removeItem(key))
  } catch {
    // Sem cache para limpar.
  }
}

function buildEnsaiosUrl(params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })

  const queryString = query.toString()

  return `/ensaios${queryString ? `?${queryString}` : ''}`
}

async function listRequest(params = {}) {
  const cacheKey = getListCacheKey(params)

  if (!pendingListRequests.has(cacheKey)) {
    const request = api.get(buildEnsaiosUrl(params))
      .then((response) => {
        if (Array.isArray(response.data)) {
          writeListCache(cacheKey, response.data)
        }

        return response
      })
      .finally(() => {
        pendingListRequests.delete(cacheKey)
      })

    pendingListRequests.set(cacheKey, request)
  }

  return pendingListRequests.get(cacheKey)
}

async function invalidateAfterRequest(request) {
  const response = await request
  invalidateListCache()
  return response
}

export const ensaiosService = {
  getCachedListar: readListCache,

  prefetchListar: (params = {}) => listRequest(params).catch(() => null),

  invalidateListCache,

  criar: (dados) => invalidateAfterRequest(api.post('/ensaios', dados)),

  listar: listRequest,

  buscarPorId: (id) => api.get(`/ensaios/${id}`),

  buscarDetalhes: (id) => api.get(`/ensaios/${id}/detalhes`),

  buscarConflitoAgenda: (dataEnsaio) => api.get('/ensaios/conflitos', {
    params: { dataEnsaio },
  }),

  exportarPdf: async (id) => {
    const response = await api.get(`/ensaios/${id}/pdf`, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type: 'application/pdf',
    })

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `ensaio-${id}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
  },

  buscarHistoricoStatus: (id) => api.get(`/ensaios/${id}/historico-status`),

  atualizar: (id, dados) => invalidateAfterRequest(api.put(`/ensaios/${id}`, dados)),

  atualizarStatus: (id, status) => invalidateAfterRequest(api.patch(`/ensaios/${id}/status`, { status })),

  atualizarObservacoes: (id, observacoes) => invalidateAfterRequest(api.patch(`/ensaios/${id}/observacoes`, { observacoes })),

  atualizarNotasInternas: (id, notasInternas) => invalidateAfterRequest(api.patch(`/ensaios/${id}/notas-internas`, { notasInternas })),

  aprovarSelecao: (id) => invalidateAfterRequest(api.patch(`/ensaios/${id}/aprovar-selecao`)),

  excluir: (id) => invalidateAfterRequest(api.delete(`/ensaios/${id}`)),
}
