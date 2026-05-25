import axios from 'axios'

import api from './api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})



const ordenarCursos = (cursos) =>
  [...cursos]
    .filter((curso) => curso?.ativo !== false)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

const normalizarCurso = (curso) => ({
  titulo: curso.titulo?.trim(),
  descricao: curso.descricao?.trim(),
  imagemUrl: curso.imagemUrl?.trim(),
  imagemPublicId: curso.imagemPublicId?.trim() || null,
  precoTexto: curso.precoTexto?.trim() || null,
  linkExterno: curso.linkExterno?.trim(),
  textoBotao: curso.textoBotao?.trim() || 'Conhecer produto',
  ativo: curso.ativo ?? true,
  ordem: Number(curso.ordem) || 0,
})

export const homepageCursosService = {
async listarAtivos() {
  try {
    const { data } = await publicApi.get('/homepage/cursos')
    return ordenarCursos(Array.isArray(data) ? data : [])
  } catch (error) {
    console.warn('[Homepage Cursos] Erro ao carregar cursos:', error?.message)
    return []
  }
},

  async listarTodos() {
    const { data } = await api.get('/homepage/cursos/admin')
    return [...(Array.isArray(data) ? data : [])].sort(
      (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
    )
  },

  async criar(curso) {
    const { data } = await api.post('/homepage/cursos', normalizarCurso(curso))
    return data
  },

  async atualizar(id, curso) {
    const { data } = await api.put(`/homepage/cursos/${id}`, normalizarCurso(curso))
    return data
  },

  async ocultar(id) {
    const { data } = await api.patch(`/homepage/cursos/${id}/ocultar`)
    return data
  },

  async ativar(id) {
    const { data } = await api.patch(`/homepage/cursos/${id}/ativar`)
    return data
  },

  async excluir(id) {
    await api.delete(`/homepage/cursos/${id}`)
  },
}
