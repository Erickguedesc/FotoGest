import api from './api'

export const clientesService = {
  criar: (dados) => api.post('/clientes', dados),
  listar: ()      => api.get('/clientes'),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  atualizar: (id, dados) => api.put(`/clientes/${id}`, dados),
  excluir: (id)   => api.delete(`/clientes/${id}`),
}