import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Toast from '../../ui/Toast'
import { solicitacoesService } from '../../../services/solicitacoesService'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'
import SolicitacoesTable from './SolicitacoesTable'
import { STATUS_LABEL, buildWhatsAppNumber } from './solicitacaoHelpers'

export default function ListaSolicitacoes() {
  const navigate = useNavigate()
  const [solicitacoes, setSolicitacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const loadSolicitacoes = async () => {
    setLoading(true)
    try {
      const response = await solicitacoesService.listar()
      setSolicitacoes(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('[Solicitações] Erro ao listar:', error?.response?.data || error)
      showToast('Não foi possível carregar as solicitações.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSolicitacoes()
  }, [])

  const countLabel = useMemo(() => {
    const total = solicitacoes.length
    return `${total} solicitaç${total === 1 ? 'ão recebida' : 'ões recebidas'}`
  }, [solicitacoes.length])

  const handleWhatsApp = (whatsapp) => {
    const numero = buildWhatsAppNumber(whatsapp)
    if (!numero) {
      showToast('WhatsApp não informado para esta solicitação.', 'error')
      return
    }

    window.open(`https://wa.me/${numero}`, '_blank', 'noopener,noreferrer')
  }

  const handleStatusChange = async (solicitacao, status) => {
    setActionId(solicitacao.id)
    try {
      const response = await solicitacoesService.atualizarStatus(solicitacao.id, status)
      const updated = response.data
      setSolicitacoes((prev) => prev.map((item) => (item.id === solicitacao.id ? updated : item)))
      showToast(`Status atualizado para "${STATUS_LABEL[updated.statusLead] || updated.statusLead}".`)
    } catch (error) {
      const msg = error?.response?.data?.message || 'Não foi possível atualizar o status.'
      showToast(msg, 'error')
    } finally {
      setActionId(null)
    }
  }

  const handlePreContrato = (solicitacao) => {
    showToast(`Importando dados de ${solicitacao.nomeCliente}...`)
    window.setTimeout(() => {
      navigate(`/ensaios/solicitacao-${solicitacao.id}/pre-contrato`, { state: { solicitacao } })
    }, 350)
  }

  return (
    <>
      <main className="relative z-[1] mx-auto max-w-[1200px] px-[5%] pb-14 pt-[110px] max-md:px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-5">
          <div>
            <h1 className="font-serif text-[32px] font-light tracking-[0.02em] text-white">
              Gerenciamento de <span className="italic text-[var(--gold)]">Solicitações</span>
            </h1>
            <p className="mt-1 text-xs text-white/40">{countLabel}</p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--gold)]">Acesso Administrativo</p>
            <p className="mt-1 text-xs text-white/45">Bem-vinda, Fotógrafa Olhari</p>
            <button
              type="button"
              onClick={loadSolicitacoes}
              className="mt-3 rounded-lg border border-white/10 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white/55 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
            >
              Atualizar
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : solicitacoes.length === 0 ? (
          <EmptyState onRefresh={loadSolicitacoes} />
        ) : (
          <SolicitacoesTable
            solicitacoes={solicitacoes}
            onWhatsApp={handleWhatsApp}
            onStatusChange={handleStatusChange}
            onPreContrato={handlePreContrato}
            actionId={actionId}
          />
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
