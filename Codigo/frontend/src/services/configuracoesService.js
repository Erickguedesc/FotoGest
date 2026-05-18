import api from './api'

export const configuracoesService = {
  buscar: async () => {
    const response = await api.get('/configuracoes')
    return response.data
  },

  atualizarFotografa: async (dados) => {
    const response = await api.put('/configuracoes/fotografa', dados)
    return response.data
  },

  atualizarEstudio: async (dados) => {
    const response = await api.put('/configuracoes/estudio', dados)
    return response.data
  },

  atualizarPreferencias: async (dados) => {
    const response = await api.put('/configuracoes/preferencias', dados)
    return response.data
  },

  alterarSenha: async (dados) => {
    const response = await api.patch('/configuracoes/senha', dados)
    return response.data
  },

  uploadFotoPerfil: async (arquivo) => {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  const response = await api.patch('/configuracoes/fotografa/foto', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
},

uploadLogoEstudio: async (arquivo) => {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  const response = await api.patch('/configuracoes/estudio/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
},
}