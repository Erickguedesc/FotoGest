import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Archive,
  ArrowDownUp,
  CalendarDays,
  Clock3,
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
} from 'lucide-react'

import Header from '../components/layout/Header'
import AppTopControls from '../components/layout/AppTopControls'
import Pagination from '../components/ensaios/listaEnsaios/Pagination'
import Toast from '../components/ui/Toast'
import ConfirmActionModal from '../components/ui/ConfirmActionModal'
import { clientesService } from '../services/clientesService'
import { ensaiosService } from '../services/ensaiosService'
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
const ORDENACOES_CLIENTES = [
  ['nome', 'Nome'],
  ['ultimaSessao', 'Último entregue'],
  ['valor', 'Valor'],
  ['quantidade', 'Qtd. ensaios'],
]
const VIEW_MODES = [
  ['cards', LayoutGrid, 'Cards'],
  ['lista', List, 'Lista'],
]
const CLIENTES_VIEW_MODE_STORAGE_KEY = 'fotolhar-clientes-view-mode'

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
  if (clienteTemFluxoAtivo(resumo)) return 'EM_ANDAMENTO'
  if (cliente.ativo === false) return 'ARQUIVADO'
  if (resumoEstaEntregue(resumo)) return 'ENTREGUE'
  return resumo.ensaios.length ? 'SEM_FLUXO' : 'SEM_ENSAIOS'
}

function getSituacaoClienteKey(cliente, resumo) {
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
  const porNome = a.cliente.nome.localeCompare(b.cliente.nome)

  if (ordenacao === 'ultimaSessao') {
    return (
      getTimeValue(b.resumo.ultimaSessao?.dataEnsaio) -
        getTimeValue(a.resumo.ultimaSessao?.dataEnsaio) || porNome
    )
  }

  if (ordenacao === 'valor') {
    return b.resumo.totalContratado - a.resumo.totalContratado || porNome
  }

  if (ordenacao === 'quantidade') {
    return b.resumo.totalEnsaios - a.resumo.totalEnsaios || porNome
  }

  return porNome
}

function formatProximoEnsaio(value) {
  const formatted = formatDateTime(value)
  const [date, time] = formatted.split(',').map((part) => part.trim())

  return {
    date: date || formatted,
    time: time || '',
  }
}

function ClienteAvatar({ nome, size = 'md' }) {
  const sizeClass =
    size === 'sm'
      ? 'h-10 w-10 text-[12px]'
      : 'h-12 w-12 text-[13px]'

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]`}
    >
      {getInitials(nome)}
    </span>
  )
}

export default function ClientesPage() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [ensaios, setEnsaios] = useState([])
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [ordenacao, setOrdenacao] = useState('nome')
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
  }, [busca, ordenacao, statusFiltro, viewMode])

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
  }, [busca, clientes, ensaios, ordenacao, statusFiltro])

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

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

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
      setClientes((atuais) =>
        atuais.map((cliente) =>
          cliente.id === clienteParaArquivar.id ? response.data : cliente
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
                className="h-11 w-full rounded-[8px] border border-[var(--border)] bg-white/64 py-2.5 pl-10 pr-3.5 text-[13px] font-light text-[var(--text)] outline-none shadow-[0_10px_24px_rgba(92,82,72,0.06)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--gold-border)] focus:bg-white"
                placeholder="Buscar cliente..."
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/novo-ensaio')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(180deg,#c57a08,#a96200)] px-5 text-[13px] font-medium text-white shadow-[0_12px_28px_rgba(137,76,0,0.22)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <Plus size={16} strokeWidth={1.8} />
              Novo Cliente
            </button>
          </div>
        </div>

        <section className="mb-5 overflow-hidden rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
          <div className="flex min-h-[118px] items-center gap-5 px-6 py-5 max-sm:flex-col max-sm:items-start">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--gold-border)] bg-white/80 text-[var(--gold)] shadow-[0_10px_24px_rgba(78,56,35,0.08)]">
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

        <div className="mb-5 flex flex-wrap gap-2 rounded-[12px] border border-[var(--border)] bg-white/64 p-2 shadow-[0_10px_24px_rgba(92,82,72,0.06)]">
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

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[var(--border)] bg-white/64 px-4 text-[12px] text-[var(--text-muted)] shadow-[0_10px_24px_rgba(92,82,72,0.06)]"
          >
            <ArrowDownUp size={14} />
            Ordenar por
          </button>

          <div className="flex flex-wrap gap-2">
            {ORDENACOES_CLIENTES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={ordenacao === value}
                onClick={() => setOrdenacao(value)}
                className={`rounded-[8px] border px-4 py-2.5 text-[12px] transition ${
                  ordenacao === value
                    ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                    : 'border-[var(--border)] bg-white/64 text-[var(--text)] hover:border-[var(--gold-border)] hover:text-[var(--gold)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ml-auto inline-flex rounded-[8px] border border-[var(--border)] bg-white/64 p-1 shadow-[0_10px_24px_rgba(92,82,72,0.06)]">
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
          <div className="rounded-[14px] border border-[var(--border)] bg-white/78 p-8 text-[var(--text-muted)] shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
            Carregando clientes...
          </div>
        ) : clientesComResumo.length === 0 ? (
          <div className="rounded-[14px] border border-[var(--border)] bg-white/78 p-10 text-center shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
            <UserRound className="mx-auto text-[var(--text-muted)]" size={34} />
            <p className="mt-4 text-[14px] text-[var(--text)]">
              Nenhum cliente encontrado.
            </p>
          </div>
        ) : viewMode === 'lista' ? (
          <section
            className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)]"
          >
            <div className="grid grid-cols-[minmax(210px,1.25fr)_118px_78px_118px_140px_112px_230px] gap-3 border-b border-[var(--border)] px-5 py-3 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] max-xl:hidden">
              <span>Cliente</span>
              <span>Situação</span>
              <span>Ensaios</span>
              <span>Último entregue</span>
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
                      <ClienteAvatar nome={cliente.nome} size="sm" />
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
                    <InfoInline label="Último entregue" value={formatDate(resumo.ultimaSessao?.dataEnsaio)} />
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
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,330px),1fr))] gap-4"
          >
            {clientesPaginados.map(({ cliente, resumo }) => {
              const telefone = cliente.telefone || ''
              const situacao = getSituacaoClienteKey(cliente, resumo)
              const arquivado = clienteEstaArquivado(cliente, resumo)
              const statusVisivel = ['EM_ANDAMENTO', 'ENTREGUE', 'ARQUIVADO'].includes(situacao)
              const proximoEnsaio = resumo.proximoEnsaio
                ? formatProximoEnsaio(resumo.proximoEnsaio.dataEnsaio)
                : null
              const ultimoTipo = resumo.ultimaSessao
                ? getTipoLabel(resumo.ultimaSessao.tipo)
                : 'Sem entrega'

              return (
                <article
                  key={cliente.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => abrirHistoricoCliente(cliente.id)}
                  onKeyDown={(event) => handleCardKeyDown(event, cliente.id)}
                  className={`cursor-pointer rounded-[14px] border p-4 outline-none shadow-[0_12px_28px_rgba(78,56,35,0.06)] transition hover:-translate-y-0.5 focus-visible:border-[var(--gold-border)] focus-visible:ring-2 focus-visible:ring-[var(--gold)]/25 ${
                    arquivado
                      ? 'border-[var(--border)] bg-white/54 opacity-75 hover:border-[var(--gold-border)]'
                      : 'border-[var(--border)] bg-white/78 hover:border-[var(--gold-border)]'
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <ClienteAvatar nome={cliente.nome} />

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-[16px] font-medium text-[var(--text)]">
                          {cliente.nome}
                        </h2>
                        <p className="mt-1 flex max-w-full items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
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
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white/62 text-[var(--text-muted)] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Info label="Ensaios" value={resumo.totalEnsaios} />
                    <Info label="Total" value={formatCurrency(resumo.totalContratado)} />
                    <Info label="Último entregue" value={formatDate(resumo.ultimaSessao?.dataEnsaio)} />
                    <Info label="Tipo entregue" value={ultimoTipo} />
                  </div>

                  {proximoEnsaio ? (
                    <div className="mt-4 rounded-[10px] border border-[var(--gold-border)] bg-[var(--gold-dim)] p-3.5">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
                        Próximo ensaio
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <CalendarDays size={15} strokeWidth={1.8} className="text-[var(--gold)]" />
                        <span className="text-[15px] font-medium leading-tight text-[var(--text)]">
                          {proximoEnsaio.date}
                        </span>
                        {proximoEnsaio.time && (
                          <span className="text-[13px] text-[var(--text-muted)]">
                            às {proximoEnsaio.time}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 inline-flex rounded-full border border-[var(--border)] bg-white/64 px-2.5 py-1 text-[11px] text-[var(--text-muted)]">
                        {getTipoLabel(resumo.proximoEnsaio.tipo)}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[10px] border border-[var(--border)] bg-white/52 p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        Próximo ensaio
                      </p>
                      <p className="mt-1 truncate text-[13px] text-[var(--text)]">
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
                      className="mt-4 inline-flex w-full items-center justify-center rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
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
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--border)] bg-white/55 px-4 py-2.5 text-[12px] text-[var(--text-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Archive size={14} strokeWidth={1.8} />
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
    </>
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
    <div className="flex items-center gap-4 rounded-[12px] border border-[var(--border)] bg-white/78 px-4 py-4 shadow-[0_12px_28px_rgba(78,56,35,0.06)]">
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
    <div className="min-w-0 rounded-[8px] border border-[var(--border)] bg-white/55 px-3 py-3">
      <p className="break-words text-[13px] leading-tight text-[var(--text)]">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.10em] text-[var(--text-muted)]">
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
