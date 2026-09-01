export const STATUS_OPTIONS = [
  { value: 'AGENDADO', label: 'Agendado', chipClass: 'bg-[rgba(113,103,232,0.10)] text-[var(--status-scheduled)] border-[rgba(113,103,232,0.26)]', progress: 0, progressColor: '#7167E8' },
  { value: 'REALIZADO', label: 'Realizado', chipClass: 'bg-[rgba(98,168,62,0.10)] text-[var(--status-completed)] border-[rgba(98,168,62,0.26)]', progress: 25, progressColor: '#62A83E' },
  { value: 'EM_SELECAO', label: 'Em seleção', chipClass: 'bg-[rgba(242,154,46,0.12)] text-[var(--status-selection)] border-[rgba(242,154,46,0.28)]', progress: 50, progressColor: '#F29A2E' },
  { value: 'EM_EDICAO', label: 'Em edição', chipClass: 'bg-[rgba(59,130,246,0.10)] text-[var(--status-editing)] border-[rgba(59,130,246,0.26)]', progress: 75, progressColor: '#3B82F6' },
  { value: 'FINALIZADO', label: 'Entregue', chipClass: 'bg-[rgba(32,184,166,0.10)] text-[var(--status-delivered)] border-[rgba(32,184,166,0.26)]', progress: 100, progressColor: '#20B8A6' },
  { value: 'CANCELADO', label: 'Cancelado', chipClass: 'bg-[rgba(239,83,80,0.10)] text-[var(--status-cancelled)] border-[rgba(239,83,80,0.28)]', progress: 0, progressColor: '#EF5350' },
]

export const STATUS_ATIVOS = ['AGENDADO', 'REALIZADO', 'EM_SELECAO', 'EM_EDICAO']

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

export const getEnsaioProgress = (ensaioOrStatus) => {
  const status = typeof ensaioOrStatus === 'string' ? ensaioOrStatus : ensaioOrStatus?.status
  const rawProgress = typeof ensaioOrStatus === 'string' ? undefined : ensaioOrStatus?.progresso
  const progress = rawProgress === undefined || rawProgress === null
    ? getStatusInfo(status).progress
    : Number(rawProgress)

  if (Number.isNaN(progress)) return 0

  return Math.max(0, Math.min(100, progress))
}

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
