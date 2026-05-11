import api from './api'

export const fotosService = {
  listarPorEnsaio: (ensaioId) => {
    return api.get(`/fotos/ensaio/${ensaioId}`)
  },

upload: (ensaioId, arquivos = [], onProgress) => {
  const formData = new FormData()

  arquivos.forEach((arquivo) => {
    formData.append('imagens', arquivo)
  })

  return api.post(`/fotos/upload/${ensaioId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (!event.total || !onProgress) return

      const percent = Math.round((event.loaded * 100) / event.total)
      onProgress(percent)
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

    removerVarios: (fotosIds = []) => {
    return Promise.all(fotosIds.map((fotoId) => api.delete(`/fotos/${fotoId}`)))
  },
}
