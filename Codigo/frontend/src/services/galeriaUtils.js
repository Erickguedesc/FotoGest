export const LIMITE_PADRAO = 30
export const VALOR_EXTRA_PADRAO = 35

export function getFotoUrl(foto) {
  return foto?.urlWatermark || foto?.url || foto?.src || ''
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDate(value) {
  if (!value) return 'Data não informada'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Data não informada'
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
