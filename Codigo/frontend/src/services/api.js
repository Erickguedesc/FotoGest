import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

function clearAuthData() {
  localStorage.removeItem('token')
  localStorage.removeItem('fotografaNome')
  localStorage.removeItem('fotografaEmail')
}

function getRequestPath(config = {}) {
  try {
    return new URL(config.url || '', config.baseURL || api.defaults.baseURL).pathname
  } catch {
    return config.url || ''
  }
}

function isPublicRequest(config = {}) {
  const path = getRequestPath(config)

  if (path.startsWith('/auth/')) {
    return true
  }

  return /^\/album\/[^/]+(\/acessar|\/selecao)?$/.test(path)
}

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login?motivo=sessao-expirada'
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Erro de rede ou servidor indisponível')
      return Promise.reject(error)
    }

    const status = error.response.status
    const message = error.response.data?.message || 'Erro inesperado'

    switch (status) {
      case 400:
        console.error('Erro de validação:', message)
        break

      case 401:
        console.warn('Não autorizado:', message)
        if (!isPublicRequest(error.config)) {
          clearAuthData()
          redirectToLogin()
        }
        break

      case 403:
        console.warn('Acesso negado:', message)
        break

      case 404:
        console.warn('Não encontrado:', message)
        break

      case 500:
        console.error('Erro interno:', message)
        break

      default:
        console.error('Erro inesperado:', message)
    }

    return Promise.reject(error)
  },
)

export default api
