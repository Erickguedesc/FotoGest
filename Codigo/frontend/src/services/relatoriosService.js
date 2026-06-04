import api from './api'

export const relatoriosService = {
  buscarFaturamento: async ({ tipo = 'MENSAL', ano, dataInicio, dataFim }) => {
    const response = await api.get('/relatorios/faturamento', {
      params: { tipo, ano, dataInicio, dataFim },
    })

    return response.data
  },

  exportarFaturamentoPdf: ({ tipo = 'MENSAL', ano, dataInicio, dataFim }) =>
    api.get('/relatorios/faturamento/pdf', {
      params: { tipo, ano, dataInicio, dataFim },
      responseType: 'blob',
    }),
}
