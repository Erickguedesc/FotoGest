import api from './api'

export const clientesService = {
  criar: (dados) => api.post('/clientes', dados),
  listar: (params = {}) => api.get('/clientes', { params }),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  atualizar: (id, dados) => api.put(`/clientes/${id}`, dados),
  arquivar: (id) => api.patch(`/clientes/${id}/arquivar`),
  reativar: (id) => api.patch(`/clientes/${id}/reativar`),
  excluir: (id)   => api.delete(`/clientes/${id}`),
}
