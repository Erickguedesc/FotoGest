import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Search, UserRound } from 'lucide-react'

import Header from '../components/layout/Header'
import Toast from '../components/ui/Toast'
import ConfirmActionModal from '../components/ui/ConfirmActionModal'
import { clientesService } from '../services/clientesService'
import { ensaiosService } from '../services/ensaiosService'
import {
  calcularResumoCliente,
  formatCurrency,
  formatDate,
  getInitials,
  getTipoLabel,
  limparTelefone,
} from '../utils/clientesHistoricoUtils'

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [ensaios, setEnsaios] = useState([])
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('ativos')
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

  const clientesComResumo = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return clientes
      .map((cliente) => ({
        cliente,
        resumo: calcularResumoCliente(cliente, ensaios),
      }))
      .filter(({ cliente }) => {
        const ativo = cliente.ativo !== false

        if (statusFiltro === 'ativos' && !ativo) return false
        if (statusFiltro === 'arquivados' && ativo) return false

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
      .sort((a, b) => a.cliente.nome.localeCompare(b.cliente.nome))
  }, [busca, clientes, ensaios, statusFiltro])

  const totalContratado = clientesComResumo.reduce(
    (total, item) => total + item.resumo.totalContratado,
    0
  )

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
      setToast({ message: 'Cliente arquivada com sucesso.', type: 'success' })
      setClienteParaArquivar(null)
    } catch (error) {
      console.error('[Clientes] Erro ao arquivar:', error?.response?.data || error)
      setToast({ message: 'Não foi possível arquivar a cliente.', type: 'error' })
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
      setToast({ message: 'Cliente reativada com sucesso.', type: 'success' })
    } catch (error) {
      console.error('[Clientes] Erro ao reativar:', error?.response?.data || error)
      setToast({ message: 'Não foi possível reativar a cliente.', type: 'error' })
    } finally {
      setActionLoading(false)
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
          <Resumo label="Clientes" value={clientes.length} />
          <Resumo label="Ensaios vinculados" value={ensaios.length} />
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
            ['ativos', 'Ativos'],
            ['arquivados', 'Arquivados'],
            ['todos', 'Todos'],
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
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clientesComResumo.map(({ cliente, resumo }) => {
              const telefone = cliente.telefone || ''
              const arquivado = cliente.ativo === false
              const ultimoTipo = resumo.ultimaSessao
                ? getTipoLabel(resumo.ultimaSessao.tipo)
                : 'Sem sessão concluída'

              return (
                <article
                  key={cliente.id}
                  className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${
                    arquivado
                      ? 'border-white/[0.06] bg-[#101010] opacity-75 hover:border-white/20'
                      : 'border-white/[0.08] bg-[#141414] hover:border-[var(--gold-border)]'
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[13px] text-[var(--gold)]">
                        {getInitials(cliente.nome)}
                      </span>

                      <div className="min-w-0">
                        <h2 className="truncate text-[16px] font-medium text-white">
                          {cliente.nome}
                        </h2>
                        <p className="mt-1 truncate text-[12px] text-white/40">
                          {cliente.cidade || 'Cidade não informada'}
                        </p>
                        {arquivado && (
                          <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
                            Arquivado
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => abrirWhatsApp(telefone)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Info label="Ensaios" value={resumo.totalEnsaios} />
                    <Info label="Total" value={formatCurrency(resumo.totalContratado)} />
                    <Info label="Última sessão" value={formatDate(resumo.ultimaSessao?.dataEnsaio)} />
                    <Info label="Tipo recente" value={ultimoTipo} />
                  </div>

                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                      Próximo ensaio
                    </p>
                    <p className="mt-1 truncate text-[13px] text-white/70">
                      {resumo.proximoEnsaio
                        ? `${formatDate(resumo.proximoEnsaio.dataEnsaio)} · ${getTipoLabel(resumo.proximoEnsaio.tipo)}`
                        : 'Nenhum agendamento futuro'}
                    </p>
                  </div>

                  <Link
                    to={`/clientes/${cliente.id}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-[var(--gold-border)] px-4 py-2.5 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
                  >
                    Ver histórico
                  </Link>

                  {arquivado ? (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReativar(cliente.id)}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-emerald-400/30 px-4 py-2.5 text-[12px] text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50"
                    >
                      Reativar cliente
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setClienteParaArquivar(cliente)}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/[0.10] px-4 py-2.5 text-[12px] text-white/45 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
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
        description={`Arquivar ${clienteParaArquivar?.nome || 'esta cliente'} remove a cliente da lista principal, mas preserva todos os ensaios, valores, histórico, relatórios e registros vinculados. Você poderá encontrá-la no filtro Arquivados e reativar depois.`}
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
