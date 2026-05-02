import api from './api'

export const ensaiosService = {
  criar: (dados) => api.post('/ensaios', dados),
  listar: () => api.get('/ensaios'),
  buscarPorId: (id) => api.get(`/ensaios/${id}`),
  atualizar: (id, dados) => api.put(`/ensaios/${id}`, dados),
  excluir: (id) => api.delete(`/ensaios/${id}`),
}