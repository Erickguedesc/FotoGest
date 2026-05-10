export const STATUS_LABEL = {
  EM_SOLICITACAO: 'Em solicitação',
  ATENDIDO: 'Atendido',
}

export const STATUS_NEXT = {
  EM_SOLICITACAO: 'ATENDIDO',
  ATENDIDO: 'EM_SOLICITACAO',
}

export function formatDate(value) {
  if (!value) return 'Sem data'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sem data'
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatPhone(value = '') {
  const digits = String(value).replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return value || 'Não informado'
}

export function buildWhatsAppNumber(value = '') {
  const digits = String(value).replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('55') ? digits : `55${digits}`
}

export function normalizeTipo(value = '') {
  return value || 'Não informado'
}
