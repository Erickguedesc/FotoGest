import api from './api'

export const homepageConfigService = {
  buscar: () => api.get('/homepage-config'),

  atualizar: (dados) => api.put('/homepage-config', dados),
}
