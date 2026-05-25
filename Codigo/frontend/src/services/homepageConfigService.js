import api from './api'

export const homepageConfigService = {
  buscar: () => api.get('/homepage-config'),

  atualizar: (dados) => api.put('/homepage-config', dados),

  async uploadImagem(arquivo) {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const { data } = await api.post('/homepage-config/imagem', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  },
}
