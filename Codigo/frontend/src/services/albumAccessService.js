import api from "./api"

export async function validarAlbumPorToken(token) {
  const response = await api.get(`/album/${token}`)
  return response.data
}

export async function acessarAlbumComSenha(token, senha) {
  const response = await api.post(`/album/${token}/access`, {
    senha,
  })

  return response.data
}