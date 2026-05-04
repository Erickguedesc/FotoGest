import api from './api'

export const ensaiosService = {
  criar: (dados) => api.post('/ensaios', dados),
  listar: (params = {}) => api.get('/ensaios', { params }),
  buscarPorId: (id) => api.get(`/ensaios/${id}`),
  atualizar: (id, dados) => api.put(`/ensaios/${id}`, dados),
  atualizarStatus: (id, status) => api.patch(`/ensaios/${id}/status`, { status }),
  excluir: (id) => api.delete(`/ensaios/${id}`),
}
