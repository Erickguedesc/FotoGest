import api from './api'

export const albumService = {
  gerar: (ensaioId) => {
    return api.post(`/album/gerar/${ensaioId}`)
  },

  buscarPorEnsaio: (ensaioId) => {
    return api.get(`/album/ensaio/${ensaioId}`)
  },

  reabrir: (ensaioId) => {
    return api.patch(`/album/reabrir/${ensaioId}`)
  },

  dadosPublicos: (token) => {
    return api.get(`/album/${token}`)
  },

  acessar: (token, senha) => {
    return api.post(`/album/${token}/acessar`, { senha })
  },

  selecionar: (token, fotosIds) => {
    return api.post(`/album/${token}/selecao`, { fotosIds })
  },

  buscarSelecao: (token) => {
    return api.get(`/album/${token}/selecao`)
  },
}