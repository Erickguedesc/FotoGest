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

  uploadFotoPerfil: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const response = await api.patch('/configuracoes/fotografa/foto', formData)

    return response.data
  },

  atualizarEstudio: async (dados) => {
    const response = await api.put('/configuracoes/estudio', dados)
    return response.data
  },

  uploadLogoEstudio: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const response = await api.patch('/configuracoes/estudio/logo', formData)

    return response.data
  },

  buscarMarcaDagua: async () => {
    const response = await api.get('/configuracoes/marca-dagua')
    return response.data
  },

  atualizarMarcaDagua: async (dados) => {
    const response = await api.put('/configuracoes/marca-dagua', dados)
    return response.data
  },

  uploadMarcaDagua: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const response = await api.patch('/configuracoes/marca-dagua/imagem', formData)

    return response.data
  },

  removerMarcaDagua: async () => {
    const response = await api.delete('/configuracoes/marca-dagua/imagem')
    return response.data
  },

  reprocessarMarcaDagua: async () => {
    const response = await api.post('/configuracoes/marca-dagua/reprocessar')
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
}