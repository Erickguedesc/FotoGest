import api from './api'

export const notificacoesService = {
  listar: async () => {
    const response = await api.get('/notificacoes')
    return response.data
  },

  dispensar: (chave) => api.delete(`/notificacoes/${encodeURIComponent(chave)}`),
}
