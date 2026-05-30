export const STATUS_OPTIONS = [
  { value: 'AGENDADO', label: 'Agendado', chipClass: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30', progress: 0 },
  { value: 'REALIZADO', label: 'Realizado', chipClass: 'bg-lime-400/10 text-lime-300 border-lime-400/30', progress: 25 },
  { value: 'EM_SELECAO', label: 'Em seleção', chipClass: 'bg-amber-400/10 text-amber-300 border-amber-400/30', progress: 50 },
  { value: 'EM_EDICAO', label: 'Em edição', chipClass: 'bg-sky-400/10 text-sky-300 border-sky-400/30', progress: 75 },
  { value: 'FINALIZADO', label: 'Entregue', chipClass: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30', progress: 100 },
  { value: 'CANCELADO', label: 'Cancelado', chipClass: 'bg-red-400/10 text-red-300 border-red-400/30', progress: 0 },
]

export const TIPO_OPTIONS = [
  { value: 'NEWBORN', label: 'Newborn' },
  { value: 'GESTANTE', label: 'Gestante' },
  { value: 'FAMILIA', label: 'Família' },
  { value: 'INFANTIL', label: 'Infantil' },
  { value: 'FEMININO', label: 'Feminino' },
  { value: 'CASAL', label: 'Casal' },
  { value: 'BOOK', label: 'Book' },
  { value: 'BATIZADO', label: 'Batizado' },
  { value: 'EXTERNO', label: 'Externo' },
  { value: 'FORMATURA', label: 'Formatura' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'DEBUTANTE', label: 'Debutante' },
  { value: 'OUTRO', label: 'Outro' },
]

export const getStatusInfo = (status) =>
  STATUS_OPTIONS.find((item) => item.value === status) || STATUS_OPTIONS[0]

export const getTipoLabel = (tipo, tipoPersonalizado) => {
  const personalizado = String(tipoPersonalizado || '').trim()

  if (tipo === 'OUTRO' && personalizado) {
    return personalizado
  }

  return TIPO_OPTIONS.find((item) => item.value === tipo)?.label || tipo || '—'
}

export const getTipoExibicao = (ensaio) =>
  ensaio?.tipoExibicao || getTipoLabel(ensaio?.tipo, ensaio?.tipoPersonalizado)

export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '??'
}

export const formatCurrency = (value) => {
  const number = Number(value || 0)
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('pt-BR')
}

export const formatDateTimeLocal = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offsetMs = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export const toApiDateTime = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export const canDeleteEnsaio = (ensaio) =>
  ensaio?.status === 'AGENDADO' || ensaio?.status === 'CANCELADO'
