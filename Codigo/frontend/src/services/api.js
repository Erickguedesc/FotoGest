import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Interceptor de REQUEST: injeta o token JWT ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de RESPONSE: trata erros globais ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚨 erro sem resposta (API caiu, CORS, etc.)
    if (!error.response) {
      console.error('Erro de rede ou servidor indisponível')
      return Promise.reject(error)
    }

    const status = error.response.status
    const message =
      error.response.data?.message || 'Erro inesperado'

    switch (status) {
      case 400:
        console.error('Erro de validação:', message)
        break

      case 401:
        console.warn('Não autorizado:', message)
        const isPublicGallery = error.config?.url?.includes('/album')
        if (!isPublicGallery) {
          localStorage.removeItem('token')
          window.location.href = '/login'
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
  }
)

export default api