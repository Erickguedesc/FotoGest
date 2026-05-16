import api from './api'

export const dashboardService = {
    buscarResumo: async () => {
        const response = await api.get('/dashboard/resumo')
        return response.data
    },
}