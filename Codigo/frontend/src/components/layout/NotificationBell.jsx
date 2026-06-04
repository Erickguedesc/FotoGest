import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  CreditCard,
  Hourglass,
  Images,
  Timer,
  X,
} from 'lucide-react'

import { notificacoesService } from '../../services/notificacoesService'

const CONFIG = {
  ENSAIO_ATRASADO: {
    icon: AlertTriangle,
    color: 'text-orange-300',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
  },
  SELECAO_ENVIADA: {
    icon: CheckCircle2,
    color: 'text-emerald-300',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  ALBUM_EXPIRANDO: {
    icon: Images,
    color: 'text-sky-300',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/20',
  },
  SELECAO_SEM_RESPOSTA: {
    icon: Hourglass,
    color: 'text-amber-300',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  STATUS_PARADO: {
    icon: Timer,
    color: 'text-violet-300',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
  },
  ENTREGA_ATRASADA: {
    icon: Clock3,
    color: 'text-red-300',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
  },
  PAGAMENTO_PENDENTE: {
    icon: CreditCard,
    color: 'text-red-300',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
  },
}

const prioridadeLabel = {
  ALTA: 'Urgente',
  MEDIA: 'Atencao',
  BAIXA: 'Info',
}

function formatDate(value) {
  if (!value) return ''

  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notificacoes, setNotificacoes] = useState([])

  const total = notificacoes.length
  const urgentes = useMemo(
    () => notificacoes.filter((item) => item.prioridade === 'ALTA').length,
    [notificacoes]
  )

  const carregar = async () => {
    try {
      setLoading(true)
      const data = await notificacoesService.listar()
      setNotificacoes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('[Notificacoes] Erro ao carregar:', error?.response?.data || error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()

    const interval = window.setInterval(carregar, 60000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDismiss = async (event, notificacao) => {
    event.stopPropagation()

    setNotificacoes((current) =>
      current.filter((item) => item.chave !== notificacao.chave)
    )

    try {
      await notificacoesService.dispensar(notificacao.chave)
    } catch (error) {
      console.error('[Notificacoes] Erro ao dispensar:', error?.response?.data || error)
      carregar()
    }
  }

  const handleOpenNotification = (notificacao) => {
    setOpen(false)
    navigate(notificacao.actionUrl || '/ensaios')
  }

  return (
    <div ref={containerRef} className="relative mr-3 flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        title="Notificacoes"
        aria-label="Notificacoes"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
      >
        <Bell size={17} />

        {total > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-bold leading-none text-black">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="theme-card absolute right-0 top-12 w-[360px] overflow-hidden rounded-2xl border shadow-2xl shadow-black/30 max-sm:right-[-64px] max-sm:w-[calc(100vw-24px)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
            <div>
              <p className="theme-title text-sm font-medium">Notificações</p>
              <p className="theme-muted mt-0.5 text-xs">
                {total
                  ? `${total} alerta${total === 1 ? '' : 's'}${urgentes ? ` · ${urgentes} urgente${urgentes === 1 ? '' : 's'}` : ''}`
                  : 'Tudo em dia por aqui'}
              </p>
            </div>

            {loading && (
              <span className="theme-muted text-[11px] uppercase tracking-[0.12em]">
                Atualizando
              </span>
            )}
          </div>

          {total === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 size={20} />
              </div>

              <p className="theme-title mt-3 text-sm font-medium">
                Nenhuma notificação
              </p>
              <p className="theme-muted mt-1 text-xs leading-5">
                Alertas importantes aparecem aqui quando algum ensaio precisa de atenção.
              </p>
            </div>
          ) : (
            <div className="theme-scrollbar max-h-[460px] overflow-y-auto p-2">
              {notificacoes.map((notificacao) => {
                const config = CONFIG[notificacao.tipo] || CONFIG.STATUS_PARADO
                const Icon = config.icon

                return (
                  <button
                    key={notificacao.chave}
                    type="button"
                    onClick={() => handleOpenNotification(notificacao)}
                    className={`mb-2 w-full rounded-xl border ${config.border} ${config.bg} p-3 text-left transition hover:translate-x-0.5 hover:border-[var(--gold-border)]`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                        <Icon size={16} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span>
                            <span className="theme-title block text-sm font-medium">
                              {notificacao.titulo}
                            </span>
                            <span className="theme-muted mt-1 block text-xs leading-5">
                              {notificacao.descricao}
                            </span>
                          </span>

                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => handleDismiss(event, notificacao)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                handleDismiss(event, notificacao)
                              }
                            }}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text)]"
                            title="Remover notificacao"
                          >
                            <X size={14} />
                          </span>
                        </span>

                        <span className="theme-muted mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-2 py-1">
                            {prioridadeLabel[notificacao.prioridade] || 'Info'}
                          </span>
                          {notificacao.clienteNome && (
                            <span className="truncate">
                              {notificacao.clienteNome}
                            </span>
                          )}
                          {notificacao.dataReferencia && (
                            <span>{formatDate(notificacao.dataReferencia)}</span>
                          )}
                        </span>
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
