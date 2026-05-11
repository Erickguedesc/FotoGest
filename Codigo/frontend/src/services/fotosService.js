import api from './api'

export const fotosService = {
  listarPorEnsaio: (ensaioId) => {
    return api.get(`/fotos/ensaio/${ensaioId}`)
  },

  upload: (ensaioId, arquivos = []) => {
    const formData = new FormData()

    arquivos.forEach((arquivo) => {
      formData.append('imagens', arquivo)
    })

    return api.post(`/fotos/upload/${ensaioId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  definirCapa: (fotoId) => {
    return api.patch(`/fotos/${fotoId}/capa`)
  },

  reordenar: (ensaioId, fotosIds) => {
    return api.patch(`/fotos/ensaio/${ensaioId}/ordenar`, fotosIds)
  },

  remover: (fotoId) => {
    return api.delete(`/fotos/${fotoId}`)
  },
}