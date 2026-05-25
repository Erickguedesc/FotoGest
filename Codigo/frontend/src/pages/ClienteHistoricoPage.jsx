import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CalendarPlus, MessageCircle, UserRound } from 'lucide-react'

import Header from '../components/layout/Header'
import Toast from '../components/ui/Toast'
import StatusBadge from '../components/ensaios/listaEnsaios/StatusBadge'
import { clientesService } from '../services/clientesService'
import { ensaiosService } from '../services/ensaiosService'
import {
  calcularResumoCliente,
  formatCurrency,
  formatDate,
  formatDateTime,
  getInitials,
  getStatusLabel,
  getTipoLabel,
  limparTelefone,
} from '../utils/clientesHistoricoUtils'

export default function ClienteHistoricoPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [cliente, setCliente] = useState(null)
  const [ensaios, setEnsaios] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    async function carregarDados() {
      setLoading(true)

      try {
        const [clienteResponse, ensaiosResponse] = await Promise.all([
          clientesService.buscarPorId(id),
          ensaiosService.listar(),
        ])

        setCliente(clienteResponse.data)
        setEnsaios(Array.isArray(ensaiosResponse.data) ? ensaiosResponse.data : [])
      } catch (error) {
        console.error('[ClienteHistórico] Erro ao carregar dados:', error?.response?.data || error)
        setToast({ message: 'Não foi possível carregar o histórico do cliente.', type: 'error' })
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [id])

  const resumo = useMemo(() => {
    if (!cliente) return null
    return calcularResumoCliente(cliente, ensaios)
  }, [cliente, ensaios])

  const statusCounts = useMemo(() => {
    return (resumo?.ensaios || []).reduce((acc, ensaio) => {
      acc[ensaio.status] = (acc[ensaio.status] || 0) + 1
      return acc
    }, {})
  }, [resumo])

  const abrirWhatsApp = () => {
    const numero = limparTelefone(cliente?.telefone)

    if (!numero) {
      setToast({ message: 'Cliente sem telefone cadastrado.', type: 'error' })
      return
    }

    window.open(`https://wa.me/${numero}`, '_blank')
  }

  const handleReativar = async () => {
    setActionLoading(true)

    try {
      const response = await clientesService.reativar(cliente.id)
      setCliente(response.data)
      setToast({ message: 'Cliente reativada com sucesso.', type: 'success' })
    } catch (error) {
      console.error('[ClienteHistórico] Erro ao reativar:', error?.response?.data || error)
      setToast({ message: 'Não foi possível reativar a cliente.', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[1200px] px-8 pt-[88px] text-white max-md:px-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-8 text-white/45">
            Carregando histórico do cliente...
          </div>
        </main>
      </>
    )
  }

  if (!cliente || !resumo) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[1200px] px-8 pt-[88px] text-white max-md:px-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-10 text-center">
            <UserRound className="mx-auto text-white/25" size={34} />
            <p className="mt-4 text-white/70">Cliente não encontrado.</p>
            <Link
              to="/clientes"
              className="mt-5 inline-flex rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)]"
            >
              Voltar para clientes
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-[1200px] px-8 pb-16 pt-[88px] text-white max-md:px-4">
        <div className="mb-5 text-[11px] text-white/40">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="transition hover:text-[var(--gold)]"
          >
            Clientes
          </button>
          <span className="mx-2 text-white/20">›</span>
          <span className="text-white/70">{cliente.nome}</span>
        </div>

        <section className="mb-5 rounded-2xl border border-[var(--gold-border)] bg-[#121212] p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-lg text-[var(--gold)]">
                {getInitials(cliente.nome)}
              </span>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]">
                  Histórico do cliente
                </p>
                <h1 className="mt-1 truncate font-serif text-[34px] font-light text-white">
                  {cliente.nome}
                </h1>
                <p className="mt-1 text-[13px] text-white/45">
                  {cliente.cidade || 'Cidade não informada'} · {cliente.indicacao || 'Origem não informada'}
                </p>
                {cliente.ativo === false && (
                  <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                    Cliente arquivada
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={abrirWhatsApp}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 px-4 py-2.5 text-[12px] text-emerald-300 transition hover:bg-emerald-400/10"
              >
                <MessageCircle size={15} />
                WhatsApp
              </button>

              <Link
                to={`/novo-ensaio?clienteId=${cliente.id}`}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-medium transition ${
                  cliente.ativo === false
                    ? 'pointer-events-none border border-white/10 text-white/30'
                    : 'bg-[var(--gold)] text-[#1A1200] hover:bg-[var(--gold-light)]'
                }`}
              >
                <CalendarPlus size={15} />
                Novo ensaio
              </Link>

              {cliente.ativo === false && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleReativar}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 px-4 py-2.5 text-[12px] text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50"
                >
                  Reativar cliente
                </button>
              )}
            </div>
          </div>
        </section>

        {cliente.ativo === false && (
          <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-[13px] leading-6 text-amber-100">
            Esta cliente está arquivada. O histórico, valores e relatórios foram preservados, mas ela fica fora da lista principal de clientes ativos. Reative a cliente antes de criar novos ensaios para ela.
          </div>
        )}

        <section className="mb-5 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <Resumo label="Ensaios" value={resumo.totalEnsaios} />
          <Resumo label="Total estimado" value={formatCurrency(resumo.totalContratado)} />
          <Resumo label="Ticket médio" value={formatCurrency(resumo.ticketMedio)} />
          <Resumo label="Última sessão" value={formatDate(resumo.ultimaSessao?.dataEnsaio)} />
        </section>

        <div className="grid grid-cols-[1fr_340px] gap-5 max-lg:grid-cols-1">
          <section className="rounded-2xl border border-white/[0.08] bg-[#121212]">
            <div className="border-b border-white/[0.08] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
                Linha do tempo
              </p>
              <h2 className="mt-1 font-serif text-2xl font-light text-white">
                Ensaios do cliente
              </h2>
            </div>

            <div className="p-5">
              {resumo.ensaios.length === 0 ? (
                <div className="rounded-xl border border-white/[0.08] bg-black/20 p-8 text-center text-white/45">
                  Nenhum ensaio vinculado a este cliente.
                </div>
              ) : (
                <div className="space-y-4">
                  {resumo.ensaios.map((ensaio) => (
                    <article
                      key={ensaio.id}
                      className="rounded-xl border border-white/[0.08] bg-black/20 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[15px] text-white">
                            {getTipoLabel(ensaio.tipo)}
                          </p>
                          <p className="mt-1 text-[12px] text-white/45">
                            {formatDateTime(ensaio.dataEnsaio)} · {ensaio.local || 'Local não informado'}
                          </p>
                        </div>
                        <StatusBadge status={ensaio.status} />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                        <Info label="Pacote" value={formatCurrency(ensaio.valorPacote)} />
                        <Info label="Fotos" value={ensaio.qtdFotosPacote || '—'} />
                        <Info label="Foto extra" value={ensaio.cobrarFotoExtra ? formatCurrency(ensaio.valorFotoExtra) : 'Não cobra'} />
                      </div>

                      {ensaio.observacoes ? (
                        <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#141414] p-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                            Observações
                          </p>
                          <p className="mt-1 text-[13px] leading-6 text-white/65">
                            {ensaio.observacoes}
                          </p>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => navigate(`/ensaios/${ensaio.id}`)}
                        className="mt-4 rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
                      >
                        Abrir ensaio
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-white/[0.08] bg-[#121212] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
                Agenda
              </p>

              <div className="mt-4 space-y-3">
                <Info
                  label="Próximo ensaio"
                  value={resumo.proximoEnsaio ? formatDateTime(resumo.proximoEnsaio.dataEnsaio) : 'Nenhum'}
                />
                <Info
                  label="Última sessão feita"
                  value={resumo.ultimaSessao ? formatDateTime(resumo.ultimaSessao.dataEnsaio) : 'Nenhuma'}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#121212] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
                Financeiro
              </p>

              <div className="mt-4 space-y-3">
                <Info label="Contratado estimado" value={formatCurrency(resumo.totalContratado)} />
                <Info label="Ticket médio" value={formatCurrency(resumo.ticketMedio)} />
                <Info label="Pagamentos registrados" value="Não controlado" />
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#121212] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
                Recorrência
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {resumo.tipos.length ? (
                  resumo.tipos.map((tipo) => (
                    <span
                      key={tipo}
                      className="rounded-full border border-white/[0.10] bg-black/20 px-3 py-1.5 text-[11px] text-white/55"
                    >
                      {tipo}
                    </span>
                  ))
                ) : (
                  <span className="text-[13px] text-white/45">
                    Nenhum tipo registrado.
                  </span>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#121212] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
                Status
              </p>

              <div className="mt-4 space-y-2">
                {Object.entries(statusCounts).length ? (
                  Object.entries(statusCounts).map(([status, total]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2"
                    >
                      <span className="text-[12px] text-white/55">
                        {getStatusLabel(status)}
                      </span>
                      <strong className="text-[13px] text-white">{total}</strong>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-white/45">
                    Sem ensaios vinculados.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

function Resumo({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#141414] px-4 py-4">
      <p className="truncate text-[18px] text-white">{value}</p>
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
