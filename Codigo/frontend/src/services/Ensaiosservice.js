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

  exportarPdf: async (id) => {
    const response = await api.get(`/ensaios/${id}/pdf`, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type: 'application/pdf',
    })

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `ensaio-${id}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
  },

  buscarHistoricoStatus: (id) => api.get(`/ensaios/${id}/historico-status`),

  atualizar: (id, dados) => api.put(`/ensaios/${id}`, dados),

  atualizarStatus: (id, status) => api.patch(`/ensaios/${id}/status`, { status }),

  excluir: (id) => api.delete(`/ensaios/${id}`),
}