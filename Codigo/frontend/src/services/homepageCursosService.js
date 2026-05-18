import axios from 'axios'

import api from './api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const cursosMock = [
  {
    id: 'mock-1',
    titulo: 'Curso de Fotografia Newborn',
    descricao:
      'Aprenda direção, segurança, composição e fluxo de atendimento para ensaios newborn com acabamento profissional.',
    imagemUrl:
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=80',
    precoTexto: 'A partir de R$ 297',
    linkExterno: 'https://www.hotmart.com',
    textoBotao: 'Conhecer curso',
    ativo: true,
    ordem: 1,
  },
  {
    id: 'mock-2',
    titulo: 'Presets Golden Lightroom',
    descricao:
      'Pacote de presets para tons quentes, pele natural e identidade visual elegante em ensaios externos e estúdio.',
    imagemUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    precoTexto: 'R$ 79,90',
    linkExterno: 'https://www.hotmart.com',
    textoBotao: 'Ver presets',
    ativo: true,
    ordem: 2,
  },
  {
    id: 'mock-3',
    titulo: 'Mentoria para Fotógrafas Iniciantes',
    descricao:
      'Encontro estratégico para organizar portfólio, atendimento, posicionamento e primeiros passos profissionais.',
    imagemUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    precoTexto: 'Sob consulta',
    linkExterno: 'https://wa.me/553199646207',
    textoBotao: 'Falar no WhatsApp',
    ativo: true,
    ordem: 3,
  },
  {
    id: 'mock-4',
    titulo: 'Aula de Edição Fotográfica',
    descricao:
      'Uma aula prática para criar consistência, corrigir pele com naturalidade e finalizar fotos com estética premium.',
    imagemUrl:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
    precoTexto: 'R$ 147',
    linkExterno: 'https://www.instagram.com',
    textoBotao: 'Conhecer aula',
    ativo: true,
    ordem: 4,
  },
]

const ordenarCursos = (cursos) =>
  [...cursos]
    .filter((curso) => curso?.ativo !== false)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

const normalizarCurso = (curso) => ({
  titulo: curso.titulo?.trim(),
  descricao: curso.descricao?.trim(),
  imagemUrl: curso.imagemUrl?.trim(),
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
      console.warn('[Homepage Cursos] Usando mock temporário:', error?.message)
      return ordenarCursos(cursosMock)
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
