export const formatCurrency = (value) => {
  const number = Number(value || 0)
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('pt-BR')
}

export const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'CL'
}

export const limparTelefone = (valor) => {
  const apenasNumeros = String(valor || '').replace(/\D/g, '')
  if (!apenasNumeros) return ''
  return apenasNumeros.startsWith('55') ? apenasNumeros : `55${apenasNumeros}`
}

export const getTipoLabel = (tipo, tipoPersonalizado) => {
  const personalizado = String(tipoPersonalizado || '').trim()

  if (tipo === 'OUTRO' && personalizado) {
    return personalizado
  }

  const labels = {
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

  return labels[tipo] || tipo || '—'
}

export const getTipoExibicao = (ensaio) =>
  ensaio?.tipoExibicao || getTipoLabel(ensaio?.tipo, ensaio?.tipoPersonalizado)

export const getStatusLabel = (status) => {
  const labels = {
    AGENDADO: 'Agendado',
    REALIZADO: 'Realizado',
    EM_SELECAO: 'Em seleção',
    EM_EDICAO: 'Em edição',
    FINALIZADO: 'Entregue',
    CANCELADO: 'Cancelado',
  }

  return labels[status] || status || '—'
}

export const getEnsaiosDoCliente = (clienteId, ensaios = []) =>
  ensaios
    .filter((ensaio) => String(ensaio.clienteId) === String(clienteId))
    .sort((a, b) => new Date(b.dataEnsaio).getTime() - new Date(a.dataEnsaio).getTime())

export const calcularResumoCliente = (cliente, ensaios = []) => {
  const ensaiosCliente = getEnsaiosDoCliente(cliente.id, ensaios)
  const agora = new Date()

  const totalContratado = ensaiosCliente.reduce(
    (total, ensaio) => total + Number(ensaio.valorFinalEnsaio ?? ensaio.valorPacote ?? 0),
    0
  )

  const ensaiosValidos = ensaiosCliente.filter((ensaio) => ensaio.status !== 'CANCELADO')
  const ultimoEnsaio = ensaiosValidos[0]
  const ensaioComFoto = ensaiosValidos.find(
    (ensaio) => Number(ensaio.totalFotos || 0) > 0 && ensaio.capaUrl
  )

  const ensaiosEntregues = ensaiosValidos
    .filter((ensaio) => {
      const date = new Date(ensaio.dataEnsaio)
      return !Number.isNaN(date.getTime()) && ensaio.status === 'FINALIZADO'
    })
    .sort((a, b) => new Date(b.dataEnsaio).getTime() - new Date(a.dataEnsaio).getTime())

  const ultimaSessao = ensaiosEntregues[0]

  const proximoEnsaio = ensaiosValidos
    .filter((ensaio) => {
      const date = new Date(ensaio.dataEnsaio)
      return !Number.isNaN(date.getTime()) && date >= agora && ensaio.status === 'AGENDADO'
    })
    .sort((a, b) => new Date(a.dataEnsaio).getTime() - new Date(b.dataEnsaio).getTime())[0]

  const tipos = [...new Set(ensaiosCliente.map((ensaio) => getTipoExibicao(ensaio)))]

  return {
    ensaios: ensaiosCliente,
    totalEnsaios: ensaiosCliente.length,
    totalContratado,
    ticketMedio: ensaiosCliente.length ? totalContratado / ensaiosCliente.length : 0,
    ultimoEnsaio,
    fotoClienteUrl: ensaioComFoto?.capaUrl || '',
    ultimaSessao,
    ensaiosEntregues,
    proximoEnsaio,
    tipos,
  }
}
