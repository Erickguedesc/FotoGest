import api from './api'

export const relatoriosService = {
  buscarFaturamento: async ({ tipo = 'MENSAL', ano }) => {
    const response = await api.get('/relatorios/faturamento', {
      params: { tipo, ano },
    })

    return response.data
  },
}