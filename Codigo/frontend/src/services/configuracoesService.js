import api from './api'

export const configuracoesService = {
  buscar: async () => {
    const response = await api.get('/configuracoes')
    return response.data
  },

  concluirOnboarding: async () => {
    const response = await api.post('/configuracoes/onboarding/concluir')
    return response.data
  },

  atualizarUsuario: async (dados) => {
    const response = await api.put('/configuracoes/usuario', dados)
    return response.data
  },

  uploadFotoPerfil: async (arquivo) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)

    const response = await api.patch('/configuracoes/usuario/foto', formData)

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

  atualizarEmail: async (dados) => {
    const response = await api.put('/configuracoes/email', dados)
    return response.data
  },

  enviarEmailTeste: async () => {
    const response = await api.post('/configuracoes/email/teste')
    return response.data
  },

  listarModelosContrato: async () => {
    const response = await api.get('/configuracoes/modelos-contrato')
    return response.data
  },

  criarModeloContrato: async (dados) => {
    const response = await api.post('/configuracoes/modelos-contrato', dados)
    return response.data
  },

  atualizarModeloContrato: async (id, dados) => {
    const response = await api.put(`/configuracoes/modelos-contrato/${id}`, dados)
    return response.data
  },

  removerModeloContrato: async (id) => {
    await api.delete(`/configuracoes/modelos-contrato/${id}`)
  },

  uploadCapaAlbumPadrao: async (arquivo) => {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  const response = await api.patch('/configuracoes/preferencias/capa-album', formData)

  return response.data
},

  alterarSenha: async (dados) => {
    const response = await api.patch('/configuracoes/senha', dados)
    return response.data
  },

  gerarBackupMetadados: async () => {
    const response = await api.post('/configuracoes/backup/metadados', null, {
      responseType: 'blob',
    })
    const agora = new Date().toISOString()
    const nomeArquivo = `fotolhar-backup-${agora.slice(0, 10)}.zip`
    const blob = new Blob([response.data], {
      type: 'application/zip',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = nomeArquivo
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return { geradoEm: agora }
  },

  gerarMarcaDaguaTexto: async (dados) => {
  const response = await api.post('/configuracoes/marca-dagua/texto', dados)
  return response.data
},
}