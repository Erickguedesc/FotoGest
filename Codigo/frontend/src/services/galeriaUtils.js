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

export function formatarDataExpiracao(value) {
  if (!value) return ''

  const date = new Date(normalizarData(value))

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function calcularTempoRestante(value) {
  if (!value) {
    return { expirado: false, tempo: null }
  }

  const expiracao = new Date(normalizarData(value))

  if (Number.isNaN(expiracao.getTime())) {
    return { expirado: false, tempo: null }
  }

  const diferenca = expiracao.getTime() - Date.now()

  if (diferenca <= 0) {
    return { expirado: true, tempo: null }
  }

  return {
    expirado: false,
    tempo: {
      dias: Math.floor(diferenca / (1000 * 60 * 60 * 24)),
      horas: Math.floor(
        (diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      ),
      minutos: Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60)),
    },
  }
}

function normalizarData(value) {
  return typeof value === 'string' ? value.replace(' ', 'T') : value
}
