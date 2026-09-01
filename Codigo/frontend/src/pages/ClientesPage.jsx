import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Archive,
  ArrowDownUp,
  CalendarDays,
  Clock3,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Tag,
  TrendingUp,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'

import Header from '../components/layout/Header'
import AppTopControls from '../components/layout/AppTopControls'
import Pagination from '../components/ensaios/listaEnsaios/Pagination'
import Toast from '../components/ui/Toast'
import ConfirmActionModal from '../components/ui/ConfirmActionModal'
import { clientesService } from '../services/clientesService'
import { ensaiosService } from '../services/ensaiosService'
import { TIPO_OPTIONS } from '../components/ensaios/listaEnsaios/ensaioHelpers'
import {
  calcularResumoCliente,
  formatCurrency,
  formatDate,
  formatDateTime,
  getInitials,
  getTipoLabel,
  limparTelefone,
} from '../utils/clientesHistoricoUtils'

const STATUS_FLUXO_ATIVO = ['AGENDADO', 'REALIZADO', 'EM_SELECAO', 'EM_EDICAO']
const SITUACAO_CLIENTE_LABELS = {
  EM_ANDAMENTO: 'Em andamento',
  ENTREGUE: 'Entregue',
  ARQUIVADO: 'Arquivado',
  SEM_ENSAIOS: 'Sem ensaios',
  SEM_FLUXO: 'Sem fluxo',
}
const SITUACAO_STYLES = {
  EM_ANDAMENTO: 'border-orange-200 bg-orange-50 text-orange-700',
  ENTREGUE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  ARQUIVADO: 'border-slate-200 bg-slate-50 text-slate-600',
  SEM_ENSAIOS: 'border-[var(--border)] bg-white/70 text-[var(--text-muted)]',
  SEM_FLUXO: 'border-[var(--border)] bg-white/70 text-[var(--text-muted)]',
}
const SORT_OPTIONS = [
  { value: 'nome:asc', label: 'Nome A-Z' },
  { value: 'nome:desc', label: 'Nome Z-A' },
  { value: 'ultimoEnsaio:desc', label: 'Último ensaio: mais recente' },
  { value: 'ultimoEnsaio:asc', label: 'Último ensaio: mais antigo' },
  { value: 'valor:desc', label: 'Mais rentáveis' },
  { value: 'valor:asc', label: 'Menos rentáveis' },
  { value: 'quantidade:desc', label: 'Mais ensaios' },
  { value: 'quantidade:asc', label: 'Menos ensaios' },
]
const VIEW_MODES = [
  ['cards', LayoutGrid, 'Cards'],
  ['lista', List, 'Lista'],
]
const CLIENTES_VIEW_MODE_STORAGE_KEY = 'fotolhar-clientes-view-mode'
const INITIAL_ADVANCED_FILTERS = {
  quantidadeEnsaios: 'todos',
  tipoEnsaio: 'todos',
  ultimoEnsaio: 'todos',
  valorInvestido: 'todos',
}
const QUANTIDADE_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: '1 ensaio' },
  { value: '2', label: '2 ensaios' },
  { value: '3', label: '3 ensaios' },
  { value: '4', label: '4 ensaios' },
  { value: '5', label: '5 ensaios' },
  { value: '6_plus', label: '6 ou mais' },
  { value: '10_plus', label: '10 ou mais' },
]
const ULTIMO_ENSAIO_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: '30_dias', label: 'Últimos 30 dias' },
  { value: '3_meses', label: 'Últimos 3 meses' },
  { value: '6_meses', label: 'Últimos 6 meses' },
  { value: '1_ano', label: 'Último ano' },
  { value: 'mais_1_ano', label: 'Há mais de 1 ano' },
  { value: 'mais_2_anos', label: 'Há mais de 2 anos' },
  { value: 'mais_3_anos', label: 'Há mais de 3 anos' },
]
const VALOR_INVESTIDO_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'ate_500', label: 'Até R$ 500' },
  { value: '500_1000', label: 'R$ 500 a R$ 1.000' },
  { value: '1000_2000', label: 'R$ 1.000 a R$ 2.000' },
  { value: '2000_3000', label: 'R$ 2.000 a R$ 3.000' },
  { value: '3000_5000', label: 'R$ 3.000 a R$ 5.000' },
  { value: '5000_7500', label: 'R$ 5.000 a R$ 7.500' },
  { value: '7500_10000', label: 'R$ 7.500 a R$ 10.000' },
  { value: '10000_plus', label: 'Acima de R$ 10.000' },
]

function getInitialViewMode() {
  const savedViewMode = localStorage.getItem(CLIENTES_VIEW_MODE_STORAGE_KEY)
  return VIEW_MODES.some(([value]) => value === savedViewMode) ? savedViewMode : 'cards'
}

function clienteTemFluxoAtivo(resumo) {
  return resumo.ensaios.some((ensaio) => STATUS_FLUXO_ATIVO.includes(ensaio.status))
}

function clienteTemEnsaioEntregue(resumo) {
  return resumo.ensaios.some((ensaio) => ensaio.status === 'FINALIZADO')
}

function resumoEstaEntregue(resumo) {
  return !clienteTemFluxoAtivo(resumo) && clienteTemEnsaioEntregue(resumo)
}

function resolverSituacaoClienteFallback(cliente, resumo) {
  if (cliente.ativo === false) return 'ARQUIVADO'
  if (clienteTemFluxoAtivo(resumo)) return 'EM_ANDAMENTO'
  if (resumoEstaEntregue(resumo)) return 'ENTREGUE'
  return resumo.ensaios.length ? 'SEM_FLUXO' : 'SEM_ENSAIOS'
}

function getSituacaoClienteKey(cliente, resumo) {
  if (cliente.ativo === false) return 'ARQUIVADO'
  return cliente.situacao || resolverSituacaoClienteFallback(cliente, resumo)
}

function clienteEstaEmAndamento(cliente, resumo) {
  return getSituacaoClienteKey(cliente, resumo) === 'EM_ANDAMENTO'
}

function clienteEstaEntregue(cliente, resumo) {
  return getSituacaoClienteKey(cliente, resumo) === 'ENTREGUE'
}

function clienteEstaArquivado(cliente, resumo) {
  return getSituacaoClienteKey(cliente, resumo) === 'ARQUIVADO'
}

function getSituacaoCliente(cliente, resumo) {
  return SITUACAO_CLIENTE_LABELS[getSituacaoClienteKey(cliente, resumo)] || 'Sem fluxo'
}

function getTimeValue(value) {
  if (!value) return 0

  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function compararClientes(a, b, ordenacao) {
  const [criterio, direcao = 'asc'] = String(ordenacao || 'nome:asc').split(':')
  const multiplicador = direcao === 'desc' ? -1 : 1
  const porNome = a.cliente.nome.localeCompare(b.cliente.nome)

  if (criterio === 'ultimoEnsaio') {
    const result =
      getTimeValue(a.resumo.ultimoEnsaio?.dataEnsaio) -
      getTimeValue(b.resumo.ultimoEnsaio?.dataEnsaio)

    return result ? result * multiplicador : porNome
  }

  if (criterio === 'valor') {
    const result = a.resumo.totalContratado - b.resumo.totalContratado
    return result ? result * multiplicador : porNome
  }

  if (criterio === 'quantidade') {
    const result = a.resumo.totalEnsaios - b.resumo.totalEnsaios
    return result ? result * multiplicador : porNome
  }

  return porNome * multiplicador
}

function getRelativeDate(days) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - days)
  return date
}

function getRelativeMonth(months) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setMonth(date.getMonth() - months)
  return date
}

function clientePassaQuantidade(total, filtro) {
  if (filtro === '1') return total === 1
  if (filtro === '2') return total === 2
  if (filtro === '3') return total === 3
  if (filtro === '4') return total === 4
  if (filtro === '5') return total === 5
  if (filtro === '6_plus') return total >= 6
  if (filtro === '10_plus') return total >= 10
  return true
}

function clientePassaUltimoEnsaio(dataValue, filtro) {
  if (filtro === 'todos') return true
  if (!dataValue) return false

  const data = new Date(dataValue)
  if (Number.isNaN(data.getTime())) return false

  if (filtro === '30_dias') return data >= getRelativeDate(30)
  if (filtro === '3_meses') return data >= getRelativeMonth(3)
  if (filtro === '6_meses') return data >= getRelativeMonth(6)
  if (filtro === '1_ano') return data >= getRelativeMonth(12)
  if (filtro === 'mais_1_ano') return data < getRelativeMonth(12)
  if (filtro === 'mais_2_anos') return data < getRelativeMonth(24)
  if (filtro === 'mais_3_anos') return data < getRelativeMonth(36)

  return true
}

function clientePassaValor(total, filtro) {
  if (filtro === 'ate_500') return total <= 500
  if (filtro === '500_1000') return total > 500 && total <= 1000
  if (filtro === '1000_2000') return total > 1000 && total <= 2000
  if (filtro === '2000_3000') return total > 2000 && total <= 3000
  if (filtro === '3000_5000') return total > 3000 && total <= 5000
  if (filtro === '5000_7500') return total > 5000 && total <= 7500
  if (filtro === '7500_10000') return total > 7500 && total <= 10000
  if (filtro === '10000_plus') return total > 10000
  return true
}

function clientePassaFiltrosAvancados(resumo, filtros) {
  const totalEnsaios = Number(resumo.totalEnsaios || 0)
  const totalContratado = Number(resumo.totalContratado || 0)
  const ultimoEnsaioData = resumo.ultimoEnsaio?.dataEnsaio

  if (!clientePassaQuantidade(totalEnsaios, filtros.quantidadeEnsaios)) return false
  if (!clientePassaUltimoEnsaio(ultimoEnsaioData, filtros.ultimoEnsaio)) return false
  if (!clientePassaValor(totalContratado, filtros.valorInvestido)) return false

  if (filtros.tipoEnsaio !== 'todos') {
    return resumo.ensaios.some((ensaio) => ensaio.tipo === filtros.tipoEnsaio)
  }

  return true
}

function contarFiltrosAtivos(filtros) {
  return Object.values(filtros).filter((value) => value !== 'todos').length
}

function formatProximoEnsaio(value) {
  const formatted = formatDateTime(value)
  const [date, time] = formatted.split(',').map((part) => part.trim())

  return {
    date: date || formatted,
    time: time || '',
  }
}

function getFotoClienteUrl(value) {
  const url = String(value || '').trim()
  if (!url) return ''

  try {
    const parsedUrl = new URL(url, window.location.origin)
    return ['http:', 'https:'].includes(parsedUrl.protocol) ? url : ''
  } catch {
    return ''
  }
}

function ClienteAvatar({ nome, fotoUrl, size = 'md' }) {
  const [imageErro, setImageErro] = useState(false)
  const fotoClienteUrl = getFotoClienteUrl(fotoUrl)
  const mostrarFoto = fotoClienteUrl && !imageErro
  const sizeClass =
    size === 'sm'
      ? 'h-10 w-10 text-[12px]'
      : 'h-10 w-10 text-[12px]'

  useEffect(() => {
    setImageErro(false)
  }, [fotoClienteUrl])

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]`}
    >
      {mostrarFoto ? (
        <img
          src={fotoClienteUrl}
          alt={nome}
          className="h-full w-full object-cover"
          onError={() => setImageErro(true)}
        />
      ) : (
        getInitials(nome)
      )}
    </span>
  )
}

export default function ClientesPage() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [ensaios, setEnsaios] = useState([])
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [ordenacao, setOrdenacao] = useState('nome:asc')
  const [filtrosAvancados, setFiltrosAvancados] = useState(INITIAL_ADVANCED_FILTERS)
  const [rascunhoFiltros, setRascunhoFiltros] = useState(INITIAL_ADVANCED_FILTERS)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [viewMode, setViewMode] = useState(getInitialViewMode)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [clienteParaArquivar, setClienteParaArquivar] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    async function carregarDados() {
      setLoading(true)

      try {
        const [clientesResponse, ensaiosResponse] = await Promise.all([
          clientesService.listar(),
          ensaiosService.listar(),
        ])

        setClientes(Array.isArray(clientesResponse.data) ? clientesResponse.data : [])
        setEnsaios(Array.isArray(ensaiosResponse.data) ? ensaiosResponse.data : [])
      } catch (error) {
        console.error('[Clientes] Erro ao carregar dados:', error?.response?.data || error)
        setToast({ message: 'Não foi possível carregar os clientes.', type: 'error' })
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  useEffect(() => {
    localStorage.setItem(CLIENTES_VIEW_MODE_STORAGE_KEY, viewMode)
  }, [viewMode])

  useEffect(() => {
    setPage(1)
  }, [busca, ordenacao, statusFiltro, filtrosAvancados, viewMode])

  const clientesComResumo = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return clientes
      .map((cliente) => ({
        cliente,
        resumo: calcularResumoCliente(cliente, ensaios),
      }))
      .filter(({ cliente, resumo }) => {
        const arquivado = clienteEstaArquivado(cliente, resumo)
        const emAndamento = clienteEstaEmAndamento(cliente, resumo)
        const entregue = clienteEstaEntregue(cliente, resumo)

        if (statusFiltro === 'andamento' && !emAndamento) return false
        if (statusFiltro === 'entregues' && (!entregue || arquivado)) return false
        if (statusFiltro === 'arquivados' && !arquivado) return false
        if (!clientePassaFiltrosAvancados(resumo, filtrosAvancados)) return false

        if (!termo) return true

        return [
          cliente.nome,
          cliente.email,
          cliente.telefone,
          cliente.cidade,
          cliente.indicacao,
        ]
          .filter(Boolean)
          .some((valor) => String(valor).toLowerCase().includes(termo))
      })
      .sort((a, b) => compararClientes(a, b, ordenacao))
  }, [busca, clientes, ensaios, filtrosAvancados, ordenacao, statusFiltro])

  const resumoClientes = useMemo(
    () =>
      clientes.reduce(
        (acc, cliente) => {
          const resumo = calcularResumoCliente(cliente, ensaios)

          if (clienteEstaEmAndamento(cliente, resumo)) acc.emAndamento += 1
          if (clienteEstaEntregue(cliente, resumo)) acc.entregues += 1
          if (clienteEstaArquivado(cliente, resumo)) acc.arquivados += 1

          return acc
        },
        { emAndamento: 0, entregues: 0, arquivados: 0 }
      ),
    [clientes, ensaios]
  )

  const totalContratado = clientesComResumo.reduce(
    (total, item) => total + item.resumo.totalContratado,
    0
  )
  const ticketMedio = clientesComResumo.length ? totalContratado / clientesComResumo.length : 0
  const totalPages = Math.max(1, Math.ceil(clientesComResumo.length / pageSize))
  const paginaAtual = Math.min(page, totalPages)
  const clientesPaginados = clientesComResumo.slice(
    (paginaAtual - 1) * pageSize,
    paginaAtual * pageSize
  )
  const statusTabs = [
    ['todos', `Todos (${clientes.length})`],
    ['andamento', `Em andamento (${resumoClientes.emAndamento})`],
    ['entregues', `Entregues (${resumoClientes.entregues})`],
    ['arquivados', `Arquivados (${resumoClientes.arquivados})`],
  ]
  const filtrosAtivos = contarFiltrosAtivos(filtrosAvancados)

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  useEffect(() => {
    if (!filtrosAbertos) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [filtrosAbertos])

  const abrirFiltros = () => {
    setRascunhoFiltros(filtrosAvancados)
    setFiltrosAbertos(true)
  }

  const aplicarFiltros = () => {
    setFiltrosAvancados(rascunhoFiltros)
    setFiltrosAbertos(false)
    setPage(1)
  }

  const limparFiltros = () => {
    setRascunhoFiltros(INITIAL_ADVANCED_FILTERS)
    setFiltrosAvancados(INITIAL_ADVANCED_FILTERS)
    setPage(1)
  }

  const atualizarRascunhoFiltro = (name, value) => {
    setRascunhoFiltros((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const abrirWhatsApp = (telefone) => {
    const numero = limparTelefone(telefone)

    if (!numero) {
      setToast({ message: 'Cliente sem telefone cadastrado.', type: 'error' })
      return
    }

    window.open(`https://wa.me/${numero}`, '_blank')
  }

  const handleArquivar = async () => {
    if (!clienteParaArquivar) return

    setActionLoading(true)

    try {
      const response = await clientesService.arquivar(clienteParaArquivar.id)
      const clienteArquivado = {
        ...clienteParaArquivar,
        ...(response.data || {}),
        ativo: false,
        situacao: 'ARQUIVADO',
      }

      setClientes((atuais) =>
        atuais.map((cliente) =>
          cliente.id === clienteParaArquivar.id ? clienteArquivado : cliente
        )
      )
      setToast({ message: 'Cliente arquivado com sucesso.', type: 'success' })
      setClienteParaArquivar(null)
    } catch (error) {
      console.error('[Clientes] Erro ao arquivar:', error?.response?.data || error)
      setToast({ message: 'Não foi possível arquivar o cliente.', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReativar = async (clienteId) => {
    setActionLoading(true)

    try {
      const response = await clientesService.reativar(clienteId)
      setClientes((atuais) =>
        atuais.map((cliente) => (cliente.id === clienteId ? response.data : cliente))
      )
      setToast({ message: 'Cliente reativado com sucesso.', type: 'success' })
    } catch (error) {
      console.error('[Clientes] Erro ao reativar:', error?.response?.data || error)
      setToast({ message: 'Não foi possível reativar o cliente.', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const abrirHistoricoCliente = (clienteId) => {
    navigate(`/clientes/${clienteId}`)
  }

  const handleCardKeyDown = (event, clienteId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      abrirHistoricoCliente(clienteId)
    }
  }

  return (
    <>
      <Header />

      <main className="ensaios-management-page relative z-[1] mx-auto max-w-[1280px] px-8 pb-16 pt-[84px] max-md:px-4 lg:pt-8">
        <div className="absolute right-8 top-6 hidden lg:block">
          <AppTopControls />
        </div>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 pr-0 lg:pr-[170px]">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Relacionamento
            </div>

            <h1 className="font-serif text-[38px] font-light leading-none tracking-normal text-[var(--text)]">
              Clientes
            </h1>

            <p className="mt-3 text-[14px] text-[var(--text)]">
              {clientesComResumo.length} cliente{clientesComResumo.length === 1 ? '' : 's'} encontrado{clientesComResumo.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex min-w-[280px] flex-1 items-center justify-end gap-3 max-md:min-w-0 max-md:flex-col max-md:items-stretch">
            <div className="relative w-full max-w-[360px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15} />
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                className="h-11 w-full rounded-[8px] border border-[var(--border)] bg-white/64 py-2.5 pl-10 pr-3.5 text-[13px] font-light text-[var(--text)] outline-none shadow-[0_10px_24px_rgba(31,31,33,0.045)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--gold-border)] focus:bg-white"
                placeholder="Buscar cliente..."
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/novo-ensaio')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#C84F32] hover:bg-[#AE3F28] px-5 text-[13px] font-medium text-white shadow-[0_12px_28px_rgba(200,79,50,0.18)] transition hover:-translate-y-0.5"
            >
              <Plus size={16} strokeWidth={1.8} />
              Novo Cliente
            </button>
          </div>
        </div>

        <section className="mb-5 overflow-hidden rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(31,31,33,0.055)]">
          <div className="flex min-h-[118px] items-center gap-5 px-6 py-5 max-sm:flex-col max-sm:items-start">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--gold-border)] bg-white/80 text-[var(--gold)] shadow-[0_10px_24px_rgba(31,31,33,0.06)]">
              <UsersRound size={30} strokeWidth={1.55} />
            </span>

            <div>
              <h2 className="text-[18px] font-medium text-[var(--text)]">
                Relacionamento que gera novos ensaios
              </h2>
              <p className="mt-2 max-w-[560px] text-[14px] leading-6 text-[var(--text-muted)]">
                Clientes bem acompanhados se tornam clientes fiéis e indicam o seu trabalho.
              </p>
              <span className="mt-3 block h-px w-16 bg-[var(--gold)]" />
            </div>
          </div>
        </section>

        <div className="mb-5 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <Resumo icon={UsersRound} label="Clientes cadastrados" value={clientes.length} />
          <Resumo icon={Clock3} label="Em andamento" value={resumoClientes.emAndamento} />
          <Resumo icon={Tag} label="Total estimado" value={formatCurrency(totalContratado)} />
          <Resumo
            icon={TrendingUp}
            label="Ticket médio"
            value={formatCurrency(ticketMedio)}
          />
        </div>

        <div className="mb-5 flex flex-wrap gap-2 rounded-[12px] border border-[var(--border)] bg-white/64 p-2 shadow-[0_10px_24px_rgba(31,31,33,0.045)]">
          {statusTabs.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFiltro(value)}
              className={`rounded-[8px] border px-4 py-2 text-[12px] transition ${
                statusFiltro === value
                  ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                  : 'border-transparent text-[var(--text-muted)] hover:bg-white hover:text-[var(--text)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[var(--border)] bg-white/64 p-3 shadow-[0_10px_24px_rgba(31,31,33,0.045)]">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[var(--border)] bg-white px-3 text-[12px] text-[var(--text)]">
              <ArrowDownUp size={14} className="text-[var(--gold)]" />
              <span className="whitespace-nowrap text-[var(--text-muted)]">Ordenar por:</span>
              <select
                value={ordenacao}
                onChange={(event) => setOrdenacao(event.target.value)}
                className="min-w-[190px] bg-transparent text-[12px] font-medium text-[var(--text)] outline-none"
                aria-label="Ordenar clientes por"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={abrirFiltros}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[var(--border)] bg-white px-3 text-[12px] font-medium text-[var(--text)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
            >
              <Filter size={14} />
              Refinar lista
              {filtrosAtivos > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1.5 text-[10px] font-semibold text-white">
                  {filtrosAtivos}
                </span>
              )}
            </button>

            {filtrosAtivos > 0 && (
              <button
                type="button"
                onClick={limparFiltros}
                className="inline-flex h-10 items-center rounded-[8px] px-3 text-[12px] font-medium text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--gold)]"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="inline-flex rounded-[8px] border border-[var(--border)] bg-white/64 p-1">
            {VIEW_MODES.map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={viewMode === value}
                onClick={() => setViewMode(value)}
                className={`inline-flex items-center gap-2 rounded-[7px] px-3.5 py-2 text-[12px] transition ${
                  viewMode === value
                    ? 'bg-[var(--gold-dim)] text-[var(--gold)]'
                    : 'text-[var(--text-muted)] hover:bg-white hover:text-[var(--text)]'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-[14px] border border-[var(--border)] bg-white/78 p-8 text-[var(--text-muted)] shadow-[0_14px_34px_rgba(31,31,33,0.055)]">
            Carregando clientes...
          </div>
        ) : clientesComResumo.length === 0 ? (
          <div className="rounded-[14px] border border-[var(--border)] bg-white/78 p-10 text-center shadow-[0_14px_34px_rgba(31,31,33,0.055)]">
            <UserRound className="mx-auto text-[var(--text-muted)]" size={34} />
            <p className="mt-4 text-[14px] text-[var(--text)]">
              Nenhum cliente encontrado.
            </p>
          </div>
        ) : viewMode === 'lista' ? (
          <section
            className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(31,31,33,0.055)]"
          >
            <div className="grid grid-cols-[minmax(210px,1.25fr)_118px_78px_118px_140px_112px_230px] gap-3 border-b border-[var(--border)] px-5 py-3 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] max-xl:hidden">
              <span>Cliente</span>
              <span>Situação</span>
              <span>Ensaios</span>
              <span>Último ensaio</span>
              <span>Próximo ensaio</span>
              <span>Total</span>
              <span>Ações</span>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {clientesPaginados.map(({ cliente, resumo }) => {
                const telefone = cliente.telefone || ''
                const arquivado = clienteEstaArquivado(cliente, resumo)
                const proximoEnsaio = resumo.proximoEnsaio
                  ? formatProximoEnsaio(resumo.proximoEnsaio.dataEnsaio)
                  : null

                return (
                  <article
                    key={cliente.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => abrirHistoricoCliente(cliente.id)}
                    onKeyDown={(event) => handleCardKeyDown(event, cliente.id)}
                    className="grid cursor-pointer grid-cols-[minmax(210px,1.25fr)_118px_78px_118px_140px_112px_230px] items-center gap-3 px-5 py-4 text-[13px] outline-none transition hover:bg-white/70 focus-visible:bg-white max-xl:grid-cols-1 max-xl:gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <ClienteAvatar nome={cliente.nome} fotoUrl={resumo.fotoClienteUrl} size="sm" />
                      <div className="min-w-0">
                        <h2 className="truncate text-[14px] font-medium text-[var(--text)]">
                          {cliente.nome}
                        </h2>
                        <p className="mt-0.5 truncate text-[12px] text-[var(--text-muted)]">
                          {cliente.cidade || 'Cidade não informada'}
                        </p>
                      </div>
                    </div>

                    <SituacaoBadge cliente={cliente} resumo={resumo} />

                    <InfoInline label="Ensaios" value={resumo.totalEnsaios} />
                    <InfoInline label="Último ensaio" value={formatDate(resumo.ultimoEnsaio?.dataEnsaio)} />
                    <InfoInline
                      label="Próximo ensaio"
                      value={proximoEnsaio ? `${proximoEnsaio.date} ${proximoEnsaio.time}` : '-'}
                    />
                    <InfoInline label="Total" value={formatCurrency(resumo.totalContratado)} />

                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <Link
                        to={`/clientes/${cliente.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[var(--gold-border)] bg-white/55 px-3 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
                      >
                        Histórico
                      </Link>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          abrirWhatsApp(telefone)
                        }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white/55 text-[var(--text-muted)] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        title="Chamar no WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </button>
                      {arquivado ? (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={(event) => {
                            event.stopPropagation()
                            handleReativar(cliente.id)
                          }}
                          className="inline-flex h-9 min-w-[82px] items-center justify-center rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 text-[12px] text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                        >
                          Reativar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setClienteParaArquivar(cliente)
                          }}
                          className="inline-flex h-9 min-w-[82px] items-center justify-center rounded-[8px] border border-[var(--border)] bg-white/55 px-3 text-[12px] text-[var(--text-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          Arquivar
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : (
          <section
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,224px),1fr))] gap-3"
          >
            {clientesPaginados.map(({ cliente, resumo }) => {
              const telefone = cliente.telefone || ''
              const situacao = getSituacaoClienteKey(cliente, resumo)
              const arquivado = clienteEstaArquivado(cliente, resumo)
              const statusVisivel = ['EM_ANDAMENTO', 'ENTREGUE', 'ARQUIVADO'].includes(situacao)
              const proximoEnsaio = resumo.proximoEnsaio
                ? formatProximoEnsaio(resumo.proximoEnsaio.dataEnsaio)
                : null
              const ultimoTipo = resumo.ultimoEnsaio
                ? getTipoLabel(resumo.ultimoEnsaio.tipo, resumo.ultimoEnsaio.tipoPersonalizado)
                : 'Sem ensaio'

              return (
                <article
                  key={cliente.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => abrirHistoricoCliente(cliente.id)}
                  onKeyDown={(event) => handleCardKeyDown(event, cliente.id)}
                  className={`cursor-pointer rounded-[12px] border p-3 outline-none shadow-[0_10px_24px_rgba(31,31,33,0.04)] transition hover:-translate-y-0.5 focus-visible:border-[var(--gold-border)] focus-visible:ring-2 focus-visible:ring-[var(--gold)]/25 ${
                    arquivado
                      ? 'border-[#D8D2CD] bg-white/72 hover:border-[var(--gold-border)]'
                      : 'border-[var(--border)] bg-white/78 hover:border-[var(--gold-border)]'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2.5">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      <ClienteAvatar nome={cliente.nome} fotoUrl={resumo.fotoClienteUrl} />

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-[14px] font-medium text-[var(--text)]">
                          {cliente.nome}
                        </h2>
                        <p className="mt-0.5 flex max-w-full items-center gap-1 text-[11px] text-[var(--text-muted)]">
                          <MapPin size={12} strokeWidth={1.8} className="shrink-0" />
                          <span className="truncate">{cliente.cidade || 'Cidade não informada'}</span>
                        </p>
                        {statusVisivel ? (
                          <SituacaoBadge cliente={cliente} resumo={resumo} />
                        ) : (
                          <span className="mt-2 block h-[24px]" aria-hidden="true" />
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        abrirWhatsApp(telefone)
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white/62 text-[var(--text-muted)] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Info label="Ensaios" value={resumo.totalEnsaios} />
                    <Info label="Total" value={formatCurrency(resumo.totalContratado)} />
                    <Info label="Último ensaio" value={formatDate(resumo.ultimoEnsaio?.dataEnsaio)} />
                    <Info label="Tipo do último" value={ultimoTipo} />
                  </div>

                  {proximoEnsaio ? (
                    <div className="mt-3 rounded-[9px] border border-[var(--gold-border)] bg-[var(--gold-dim)] p-2.5">
                      <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--gold)]">
                        Próximo ensaio
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                        <CalendarDays size={14} strokeWidth={1.8} className="text-[var(--gold)]" />
                        <span className="text-[13px] font-medium leading-tight text-[var(--text)]">
                          {proximoEnsaio.date}
                        </span>
                        {proximoEnsaio.time && (
                          <span className="text-[11px] text-[var(--text-muted)]">
                            às {proximoEnsaio.time}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 inline-flex max-w-full truncate rounded-full border border-[var(--border)] bg-white/64 px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                        {getTipoLabel(resumo.proximoEnsaio.tipo, resumo.proximoEnsaio.tipoPersonalizado)}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-[9px] border border-[var(--border)] bg-white/52 p-2.5">
                      <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        Próximo ensaio
                      </p>
                      <p className="mt-1 truncate text-[12px] text-[var(--text)]">
                        Nenhum agendamento futuro
                      </p>
                    </div>
                  )}

                  {arquivado ? (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={(event) => {
                        event.stopPropagation()
                        handleReativar(cliente.id)
                      }}
                      className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 text-[11px] text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                    >
                      Reativar cliente
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setClienteParaArquivar(cliente)
                      }}
                      className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-white/55 px-3 text-[11px] text-[var(--text-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Archive size={13} strokeWidth={1.8} />
                      Arquivar cliente
                    </button>
                  )}
                </article>
              )
            })}
          </section>
        )}

        {!loading && clientesComResumo.length > 0 && (
          <Pagination
            page={paginaAtual}
            totalPages={totalPages}
            pageSize={pageSize}
            total={clientesComResumo.length}
            itemLabel="cliente"
            ariaLabel="Paginacao dos clientes"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmActionModal
        open={Boolean(clienteParaArquivar)}
        type="warning"
        title="Arquivar cliente?"
        description={`Arquivar ${clienteParaArquivar?.nome || 'este cliente'} remove o cliente da lista Em andamento, mas preserva todos os ensaios, valores, histórico, relatórios e registros vinculados. Você poderá encontrá-lo no filtro Arquivados e reativar depois.`}
        confirmText="Arquivar cliente"
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) setClienteParaArquivar(null)
        }}
        onConfirm={handleArquivar}
      />

      {filtrosAbertos && (
        <ClientesFilterPanel
          values={rascunhoFiltros}
          onChange={atualizarRascunhoFiltro}
          onApply={aplicarFiltros}
          onClear={limparFiltros}
          onClose={() => setFiltrosAbertos(false)}
        />
      )}
    </>
  )
}

function ClientesFilterPanel({ values, onChange, onApply, onClear, onClose }) {
  return (
    <div className="fixed inset-0 z-[420] bg-[#1F1F21]/30 backdrop-blur-[2px]">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Fechar filtros"
        onClick={onClose}
      />

      <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-[360px] flex-col border-l border-[var(--border)] bg-white shadow-[0_24px_70px_rgba(31,31,33,0.18)] max-sm:max-w-full">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[var(--text)]">
              Filtros
            </h2>
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              Refine clientes usando dados reais dos ensaios.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Fechar filtros"
            aria-label="Fechar filtros"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--text-muted)] transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <FilterSelect
            label="Quantidade de ensaios"
            value={values.quantidadeEnsaios}
            options={QUANTIDADE_OPTIONS}
            onChange={(value) => onChange('quantidadeEnsaios', value)}
          />

          <FilterSelect
            label="Tipo de ensaio"
            value={values.tipoEnsaio}
            options={[{ value: 'todos', label: 'Todos' }, ...TIPO_OPTIONS]}
            onChange={(value) => onChange('tipoEnsaio', value)}
          />

          <FilterSelect
            label="Último ensaio"
            value={values.ultimoEnsaio}
            options={ULTIMO_ENSAIO_OPTIONS}
            onChange={(value) => onChange('ultimoEnsaio', value)}
          />

          <FilterSelect
            label="Valor total investido"
            value={values.valorInvestido}
            options={VALOR_INVESTIDO_OPTIONS}
            onChange={(value) => onChange('valorInvestido', value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[var(--border)] px-5 py-4">
          <button
            type="button"
            onClick={onClear}
            className="h-10 rounded-[8px] border border-[#C9C3BD] bg-white px-4 text-[12px] font-semibold text-[#2F3033] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
          >
            Limpar filtros
          </button>

          <button
            type="button"
            onClick={onApply}
            className="h-10 rounded-[8px] bg-[#C84F32] px-4 text-[12px] font-semibold text-white shadow-[0_12px_28px_rgba(200,79,50,0.18)] transition hover:bg-[#AE3F28]"
          >
            Aplicar filtros
          </button>
        </div>
      </aside>
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[8px] border border-[var(--border)] bg-white px-3 text-[13px] text-[var(--text)] outline-none transition focus:border-[var(--gold-border)] focus:ring-4 focus:ring-[#C84F32]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function SituacaoBadge({ cliente, resumo }) {
  const situacao = getSituacaoClienteKey(cliente, resumo)
  const style = SITUACAO_STYLES[situacao] || SITUACAO_STYLES.SEM_FLUXO

  return (
    <span className={`mt-2 flex w-fit max-w-full whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${style}`}>
      {getSituacaoCliente(cliente, resumo)}
    </span>
  )
}

function Resumo({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-[12px] border border-[var(--border)] bg-white/78 px-4 py-4 shadow-[0_12px_28px_rgba(31,31,33,0.045)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-[var(--gold)]">
        {Icon ? <Icon size={22} strokeWidth={1.7} /> : null}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[18px] text-[var(--text)]">{value}</p>
        <p className="mt-1 text-[12px] text-[var(--text-muted)]">
          {label}
        </p>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[var(--border)] bg-white/55 px-2.5 py-2">
      <p className="truncate text-[12px] leading-tight text-[var(--text)]">{value}</p>
      <p className="mt-1 truncate text-[9px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  )
}

function InfoInline({ label, value }) {
  return (
    <div className="min-w-0">
      <span className="hidden text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] max-xl:block">
        {label}
      </span>
      <span className="block truncate text-[var(--text)]">{value}</span>
    </div>
  )
}
