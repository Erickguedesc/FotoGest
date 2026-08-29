import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowDownUp, LayoutGrid, List, MessageCircle, Search, UserRound } from 'lucide-react'

import Header from '../components/layout/Header'
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
const LIMITE_CLIENTES_SEM_SCROLL = 9
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

function getClienteAvatarUrl(resumo) {
  return resumo.ensaios.find((ensaio) => ensaio.capaUrl)?.capaUrl || ''
}

function ClienteAvatar({ nome, src, size = 'md' }) {
  const [imageError, setImageError] = useState(false)
  const hasImage = src && !imageError
  const sizeClass = size === 'sm' ? 'h-10 w-10 text-[12px]' : 'h-12 w-12 text-[13px]'

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]`}
    >
      {hasImage ? (
        <img
          src={src}
          alt={nome ? `Capa de ${nome}` : 'Capa do cliente'}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
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
  const [ordenacao, setOrdenacao] = useState('nome')
  const [viewMode, setViewMode] = useState(getInitialViewMode)
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
  const resultadosComScroll = clientesComResumo.length > LIMITE_CLIENTES_SEM_SCROLL

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

      <main className="mx-auto max-w-[1200px] px-8 pb-16 pt-[88px] text-white max-md:px-4">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[10.5px] uppercase tracking-[0.2em] text-white/30">
              Relacionamento
            </div>

            <h1 className="font-serif text-[32px] font-light tracking-[0.04em] text-white">
              Clientes
            </h1>

            <p className="mt-0.5 text-[12px] text-white/35">
              {clientesComResumo.length} cliente{clientesComResumo.length === 1 ? '' : 's'} encontrado{clientesComResumo.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="relative min-w-[260px] max-w-[380px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={15} />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              className="w-full rounded-lg border border-white/[0.10] bg-[#181818] py-2.5 pl-10 pr-3.5 text-[13px] font-light text-white outline-none transition placeholder:text-white/25 focus:border-[var(--gold-border)] focus:bg-[rgba(201,164,89,0.04)]"
              placeholder="Buscar cliente..."
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <Resumo label="Clientes Cadastrados" value={clientes.length} />
          <Resumo label="Em andamento" value={resumoClientes.emAndamento} />
          <Resumo label="Total estimado" value={formatCurrency(totalContratado)} />
          <Resumo
            label="Ticket médio"
            value={formatCurrency(
              clientesComResumo.length ? totalContratado / clientesComResumo.length : 0
            )}
          />
        </div>

        <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-white/[0.08] bg-[#141414] p-2">
          {[
            ['todos', 'Todos'],
            ['andamento', 'Em andamento'],
            ['entregues', 'Entregues'],
            ['arquivados', 'Arquivados'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFiltro(value)}
              className={`rounded-lg px-4 py-2 text-[12px] transition ${
                statusFiltro === value
                  ? 'border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                  : 'border border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white/75'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#141414] px-3 py-2.5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/35">
            <ArrowDownUp size={14} />
            Ordenar por
          </div>

          <div className="flex flex-wrap gap-2">
            {ORDENACOES_CLIENTES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={ordenacao === value}
                onClick={() => setOrdenacao(value)}
                className={`rounded-lg border px-3.5 py-2 text-[12px] transition ${
                  ordenacao === value
                    ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                    : 'border-white/[0.08] text-white/45 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/75'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex justify-end">
          <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#141414] p-1">
            {VIEW_MODES.map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={viewMode === value}
                onClick={() => setViewMode(value)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12px] transition ${
                  viewMode === value
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-8 text-white/45">
            Carregando clientes...
          </div>
        ) : clientesComResumo.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-10 text-center">
            <UserRound className="mx-auto text-white/25" size={34} />
            <p className="mt-4 text-[14px] text-white/70">
              Nenhum cliente encontrado.
            </p>
          </div>
        ) : viewMode === 'lista' ? (
          <section
            className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[#141414] ${
              resultadosComScroll ? 'max-h-[760px] overflow-y-auto pr-1 theme-scrollbar' : ''
            }`}
          >
            <div className="grid grid-cols-[minmax(210px,1.25fr)_118px_78px_118px_140px_112px_230px] gap-3 border-b border-[var(--border)] px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-white/35 max-xl:hidden">
              <span>Cliente</span>
              <span>Situação</span>
              <span>Ensaios</span>
              <span>Último entregue</span>
              <span>Próximo ensaio</span>
              <span>Total</span>
              <span>Ações</span>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {clientesComResumo.map(({ cliente, resumo }) => {
                const telefone = cliente.telefone || ''
                const arquivado = clienteEstaArquivado(cliente, resumo)
                const avatarUrl = getClienteAvatarUrl(resumo)
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
                    className="grid cursor-pointer grid-cols-[minmax(210px,1.25fr)_118px_78px_118px_140px_112px_230px] items-center gap-3 px-5 py-4 text-[13px] outline-none transition hover:bg-white/[0.025] focus-visible:bg-white/[0.035] max-xl:grid-cols-1 max-xl:gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <ClienteAvatar nome={cliente.nome} src={avatarUrl} size="sm" />
                      <div className="min-w-0">
                        <h2 className="truncate text-[14px] font-medium text-white">
                          {cliente.nome}
                        </h2>
                        <p className="mt-0.5 truncate text-[12px] text-white/40">
                          {cliente.cidade || 'Cidade não informada'}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55">
                      {getSituacaoCliente(cliente, resumo)}
                    </span>

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
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--gold-border)] px-3 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
                      >
                        Histórico
                      </Link>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          abrirWhatsApp(telefone)
                        }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
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
                          className="inline-flex h-9 min-w-[82px] items-center justify-center rounded-lg border border-emerald-400/30 px-3 text-[12px] text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50"
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
                          className="inline-flex h-9 min-w-[82px] items-center justify-center rounded-lg border border-white/[0.10] px-3 text-[12px] text-white/45 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
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
            className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${
              resultadosComScroll ? 'max-h-[1120px] overflow-y-auto pr-2 theme-scrollbar' : ''
            }`}
          >
            {clientesComResumo.map(({ cliente, resumo }) => {
              const telefone = cliente.telefone || ''
              const situacao = getSituacaoClienteKey(cliente, resumo)
              const arquivado = clienteEstaArquivado(cliente, resumo)
              const avatarUrl = getClienteAvatarUrl(resumo)
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
                  className={`cursor-pointer rounded-2xl border p-5 outline-none transition hover:-translate-y-0.5 focus-visible:border-[var(--gold-border)] focus-visible:ring-2 focus-visible:ring-[var(--gold)]/25 ${
                    arquivado
                      ? 'border-white/[0.06] bg-[#101010] opacity-75 hover:border-white/20'
                      : 'border-white/[0.08] bg-[#141414] hover:border-[var(--gold-border)]'
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <ClienteAvatar nome={cliente.nome} src={avatarUrl} />

                      <div className="min-w-0">
                        <h2 className="truncate text-[16px] font-medium text-white">
                          {cliente.nome}
                        </h2>
                        <p className="mt-1 truncate text-[12px] text-white/40">
                          {cliente.cidade || 'Cidade não informada'}
                        </p>
                        {statusVisivel ? (
                          <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
                            {getSituacaoCliente(cliente, resumo)}
                          </span>
                        ) : (
                          <span className="mt-2 block h-[26px]" aria-hidden="true" />
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        abrirWhatsApp(telefone)
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
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
                    <div className="mt-4 rounded-xl border border-[var(--gold-border)] bg-[rgba(201,164,89,0.08)] p-3.5 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
                        Próximo ensaio
                      </p>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-[17px] font-medium leading-tight text-white">
                          {proximoEnsaio.date}
                        </span>
                        {proximoEnsaio.time && (
                          <span className="text-[13px] text-white/55">
                            às {proximoEnsaio.time}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 inline-flex rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[11px] text-white/55">
                        {getTipoLabel(resumo.proximoEnsaio.tipo)}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                        Próximo ensaio
                      </p>
                      <p className="mt-1 truncate text-[13px] text-white/70">
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
                      className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-emerald-400/30 px-4 py-2.5 text-[12px] text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50"
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
                      className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-white/[0.10] px-4 py-2.5 text-[12px] text-white/45 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
                    >
                      Arquivar cliente
                    </button>
                  )}
                </article>
              )
            })}
          </section>
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

function Resumo({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#141414] px-4 py-4">
      <p className="text-[18px] text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-3">
      <p className="truncate text-[13px] text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
    </div>
  )
}

function InfoInline({ label, value }) {
  return (
    <div className="min-w-0">
      <span className="hidden text-[10px] uppercase tracking-[0.14em] text-white/35 max-xl:block">
        {label}
      </span>
      <span className="block truncate text-white/70">{value}</span>
    </div>
  )
}
