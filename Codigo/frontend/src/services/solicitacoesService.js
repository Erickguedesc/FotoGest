import api from './api'

export const solicitacoesService = {
  criar: (dados) => api.post('/solicitacoes', dados),

  listar: () => api.get('/solicitacoes'),

  atualizarStatus: (id, status) =>
    api.patch(`/solicitacoes/${id}/status?status=${status}`),

  deletar: (id) =>
    api.delete(`/solicitacoes/${id}`)
}