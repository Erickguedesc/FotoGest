export const ESTADOS_BRASILEIROS = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' },
]

const UF_SET = new Set(ESTADOS_BRASILEIROS.map((estado) => estado.uf))

function semAcentos(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export function normalizarEstadoUf(value) {
  const texto = String(value || '').trim()
  if (!texto) return ''

  const upper = texto.toUpperCase()
  if (UF_SET.has(upper)) return upper

  const estado = ESTADOS_BRASILEIROS.find(
    (item) => semAcentos(item.nome) === semAcentos(texto),
  )

  return estado?.uf || ''
}

export function getNomeEstado(uf) {
  return ESTADOS_BRASILEIROS.find((estado) => estado.uf === uf)?.nome || ''
}

export function removerEstadoDoTexto(value) {
  const texto = String(value || '').trim()
  if (!texto) return ''

  const partes = texto.split(/\s*[,/-]\s*/).filter(Boolean)
  if (partes.length <= 1) return texto

  const possivelEstado = partes[partes.length - 1]
  return normalizarEstadoUf(possivelEstado)
    ? partes.slice(0, -1).join(', ').trim()
    : texto
}
