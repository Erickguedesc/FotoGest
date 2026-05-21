import api from './api'

export async function validarAlbumPorToken(token) {
  const response = await api.get(`/album/${token}`)
  return response.data
}

export async function acessarAlbumComSenha(token, senha) {
  const response = await api.post(`/album/${token}/acessar`, {
    senha: senha.trim().toUpperCase(),
  })

  return response.data
}

export async function enviarSelecaoFotos(token, fotosIds, observacoesPorFoto = {}) {
  const response = await api.post(`/album/${token}/selecao`, {
    fotosIds,
    observacoesPorFoto,
  })

  return response.data
}

export async function buscarSelecaoAlbum(token) {
  const response = await api.get(`/album/${token}/selecao`)
  return response.data
}
