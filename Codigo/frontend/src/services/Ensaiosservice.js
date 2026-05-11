import api from './api'

export const ensaiosService = {
  criar: (dados) => api.post('/ensaios', dados),

  listar: (params = {}) => {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value)
      }
    })

    const queryString = query.toString()

    return api.get(`/ensaios${queryString ? `?${queryString}` : ''}`)
  },

  buscarPorId: (id) => api.get(`/ensaios/${id}`),

  buscarHistoricoStatus: (id) => api.get(`/ensaios/${id}/historico-status`),

  atualizar: (id, dados) => api.put(`/ensaios/${id}`, dados),

  atualizarStatus: (id, status) => api.patch(`/ensaios/${id}/status`, { status }),

  excluir: (id) => api.delete(`/ensaios/${id}`),
}