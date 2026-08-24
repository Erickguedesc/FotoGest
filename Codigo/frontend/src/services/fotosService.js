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

  removerVarios: async (fotosIds = [], onProgress) => {
    const removidas = []
    const falhas = []

    for (const fotoId of fotosIds) {
      try {
        await api.delete(`/fotos/${fotoId}`)
        removidas.push(fotoId)
      } catch (error) {
        falhas.push({ fotoId, error })

        if (error?.response?.status === 401) {
          throw error
        }
      } finally {
        onProgress?.({
          total: fotosIds.length,
          concluidas: removidas.length + falhas.length,
          removidas: removidas.length,
          falhas: falhas.length,
        })
      }
    }

    return { removidas, falhas }
  },
}
