export const TIPOS_PERIODO = [
  {
    value: 'ANUAL',
    label: 'Anual',
    detalhe: '1 período',
  },
  {
    value: 'SEMESTRAL',
    label: 'Semestral',
    detalhe: '2 semestres',
  },
  {
    value: 'TRIMESTRAL',
    label: 'Trimestral',
    detalhe: '4 trimestres',
  },
  {
    value: 'MENSAL',
    label: 'Mensal',
    detalhe: '12 meses',
  },
]

export function formatMoney(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0)
}

export function formatDateBR(date) {
  if (!date) return '—'

  return new Intl.DateTimeFormat('pt-BR').format(
    new Date(`${date}T00:00:00`)
  )
}

export function getAnosDisponiveis() {
  const anoAtual = new Date().getFullYear()

  return [anoAtual - 2, anoAtual - 1, anoAtual, anoAtual + 1]
}

export function getTipoPeriodoLabel(tipo) {
  const tipoEncontrado = TIPOS_PERIODO.find((item) => item.value === tipo)

  return tipoEncontrado?.label || tipo
}