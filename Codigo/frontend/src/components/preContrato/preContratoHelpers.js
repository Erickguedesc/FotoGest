export const TIPO_LABELS = {
  NEWBORN: 'Newborn',
  GESTANTE: 'Gestante',
  FAMILIA: 'Família',
  INFANTIL: 'Infantil',
  FEMININO: 'Feminino',
  CASAL: 'Casal',
  BOOK: 'Book',
  BATIZADO: 'Batizado',
  EXTERNO: 'Externo',
  FORMATURA: 'Formatura',
  EVENTO: 'Evento',
  DEBUTANTE: 'Debutante',
  OUTRO: 'Outro',
}

const pad = (value) => String(value).padStart(2, '0')

export function formatTipo(value = '') {
  return TIPO_LABELS[value] || value || ''
}

export function formatDate(value, fallback = '') {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('pt-BR')
}

export function formatLongDate(value, fallback = '') {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatCurrency(value, fallback = 'R$ 0,00') {
  const number = Number(value)
  if (Number.isNaN(number)) return fallback
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function parseCurrencyValue(value) {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0

  let text = String(value).trim()
  if (!text) return 0

  text = text.replace(/[^\d,.-]/g, '')

  if (text.includes(',')) {
    text = text.replace(/\./g, '').replace(',', '.')
  }

  const number = Number.parseFloat(text)
  return Number.isNaN(number) ? 0 : number
}

export function parseQuantityValue(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback

  const text = String(value).replace(/[^\d,.-]/g, '').replace(',', '.')
  const number = Number.parseFloat(text)
  return Number.isNaN(number) ? fallback : number
}

export function normalizeMoneyInput(value, fallback = '') {
  if (value === null || value === undefined || value === '') return ''
  const number = parseCurrencyValue(value)
  return number > 0 ? formatCurrency(number) : fallback || String(value)
}

export function normalizeFotoExtraInput(value) {
  if (value === null || value === undefined || value === '') return ''
  const number = parseCurrencyValue(value)
  return number > 0 ? `${formatCurrency(number)} / foto` : String(value)
}

export function recalculateFinancialDraft(draft, changedField) {
  const next = { ...draft }

  if (changedField === 'valorPacote') next.valorPacote = normalizeMoneyInput(next.valorPacote)
  if (changedField === 'valorFotoExtra') next.valorFotoExtra = normalizeFotoExtraInput(next.valorFotoExtra)
  if (changedField === 'deslocamento') next.deslocamento = normalizeMoneyInput(next.deslocamento, next.deslocamento)
  if (changedField === 'sinal') next.sinal = normalizeMoneyInput(next.sinal)

  const quantidadePacote = parseQuantityValue(next.quantidadePacote, 1) || 1
  const valorPacote = parseCurrencyValue(next.valorPacote)
  const subtotalPacote = quantidadePacote * valorPacote

  const qtdFotosExtras = parseQuantityValue(next.qtdFotosExtras, 0)
  const valorFotoExtra = parseCurrencyValue(next.valorFotoExtra)
  const subtotalFotosExtras = qtdFotosExtras * valorFotoExtra

  const deslocamento = parseCurrencyValue(next.deslocamento)
  const total = subtotalPacote + subtotalFotosExtras + deslocamento
  const sinal = parseCurrencyValue(next.sinal)
  const saldo = Math.max(total - sinal, 0)

  next.subtotalPacote = subtotalPacote > 0 ? formatCurrency(subtotalPacote) : ''
  next.subtotalFotosExtras = subtotalFotosExtras > 0 ? formatCurrency(subtotalFotosExtras) : 'A calcular'
  next.totalPacote = total > 0 ? formatCurrency(total) : ''
  next.saldo = total > 0 ? formatCurrency(saldo) : ''

  return next
}

export function onlyDigits(value = '') {
  return String(value).replace(/\D/g, '')
}

export function formatPhone(value = '') {
  const digits = onlyDigits(value)
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return value || ''
}

export function buildDocumentNumber(id) {
  const now = new Date()
  const suffix = String(id || Math.floor(Math.random() * 9999)).replace(/\D/g, '').slice(-4).padStart(4, '0')
  return `#${now.getFullYear()}-${suffix}`
}

export function buildInitialDraft({ ensaio, cliente, solicitacao }) {
  const hoje = new Date()
  const validade = new Date(hoje)
  validade.setDate(validade.getDate() + 15)

  const valorPacote = ensaio?.valorPacote ?? ''
  const qtdFotos = ensaio?.qtdFotosPacote ?? ''
  const valorFotoExtra = ensaio?.valorFotoExtra ?? ''
  const sinal = valorPacote ? Number(valorPacote) / 3 : ''

  const clienteNome = cliente?.nome || ensaio?.clienteNome || solicitacao?.nomeCliente || ''
  const tipo = ensaio?.tipo || solicitacao?.tipoEnsaio || ''

  const initialDraft = {
    numeroDocumento: buildDocumentNumber(ensaio?.id || solicitacao?.id),
    statusDocumento: 'Aguardando assinatura',
    dataEmissao: formatLongDate(hoje),
    dataEmissaoCurta: formatDate(hoje),
    validade: formatLongDate(validade),
    cidadeAssinatura: 'Belo Horizonte',

    fotografaNome: 'Maria Clara Souza',
    fotografaEmail: 'contato@olhari.com',
    fotografaTelefone: '(31) 99000-1234',
    fotografaCidade: 'Belo Horizonte, Minas Gerais',
    fotografaDocumento: 'CNPJ 00.000.000/0001-00',

    clienteNome,
    clienteCpf: cliente?.cpf || '',
    clienteTelefone: formatPhone(cliente?.telefone || solicitacao?.whatsapp || ''),
    clienteEmail: cliente?.email || '',
    clienteCidade: cliente?.cidade || '',
    clienteIndicacao: cliente?.indicacao || '',

    tipoEnsaio: formatTipo(tipo),
    dataEnsaio: formatLongDate(ensaio?.dataEnsaio || solicitacao?.dataDesejada, ''),
    horario: '',
    local: ensaio?.local || '',
    observacoes: ensaio?.observacoes || '',

    descricaoPacote: tipo ? `Ensaio ${formatTipo(tipo)} — pacote completo` : 'Ensaio fotográfico — pacote completo',
    quantidadePacote: '1',
    valorPacote: valorPacote ? formatCurrency(valorPacote) : '',
    subtotalPacote: valorPacote ? formatCurrency(valorPacote) : '',
    qtdFotos: qtdFotos ? `${qtdFotos} fotos` : '',
    qtdFotosExtras: '',
    valorFotoExtra: valorFotoExtra ? `${formatCurrency(valorFotoExtra)} / foto` : '',
    subtotalFotosExtras: 'A calcular',
    deslocamento: 'Incluso',
    totalPacote: valorPacote ? formatCurrency(valorPacote) : '',
    formaPagamento: 'PIX / Transferência',
    sinal: sinal ? formatCurrency(sinal) : '',
    saldo: '',
  }

  return recalculateFinancialDraft(initialDraft)
}
