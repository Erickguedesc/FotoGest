import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Toast from '../ui/Toast'
import { clientesService } from '../../services/clientesService'
import { ensaiosService } from '../../services/ensaiosService'
import ContractDocument from './ContractDocument'
import LoadingState from './LoadingState'
import PreContratoBreadcrumb from './PreContratoBreadcrumb'
import PreContratoTop from './PreContratoTop'
import { buildInitialDraft } from './preContratoHelpers'
import '../../styles/pre-contrato.css'

export default function PreContrato() {
  const { ensaioId } = useParams()

  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await ensaiosService.buscarPorId(ensaioId)
        const ensaio = response.data
        let cliente = null

        if (ensaio?.clienteId) {
          try {
            const clienteResponse = await clientesService.buscarPorId(ensaio.clienteId)
            cliente = clienteResponse.data
          } catch (clienteError) {
            console.warn('[Pré-contrato] Não foi possível carregar o cliente completo:', clienteError?.response?.data || clienteError)
          }
        }

        if (active) setDraft(buildInitialDraft({ ensaio, cliente }))
      } catch (err) {
        console.error('[Pré-contrato] Erro ao carregar dados:', err?.response?.data || err)
        if (active) {
          setError('Não foi possível carregar os dados. Você ainda pode preencher o pré-contrato manualmente.')
          setDraft(buildInitialDraft({}))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [ensaioId])

  const showToast = (message, type = 'success') => setToast({ message, type })

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href)
      showToast('Link do pré-contrato copiado!')
    } catch {
      showToast('Não foi possível copiar o link.', 'error')
    }
  }

  const handleExportPDF = () => {
    showToast('Abrindo diálogo de impressão / salvar PDF...', 'gold')
    window.setTimeout(() => window.print(), 500)
  }

  if (loading || !draft) return <LoadingState />

  return (
    <>
      <main className="precontrato-main">
        <PreContratoBreadcrumb clienteNome={draft.clienteNome} />
        <PreContratoTop
          clienteNome={draft.clienteNome}
          sourceLabel="do ensaio"
          onCopyLink={handleCopyLink}
          onExportPDF={handleExportPDF}
        />

        {error && (
          <div className="mb-5 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200/90">
            {error}
          </div>
        )}

        <div className="precontrato-fill-hint">
          Campos com dados incompletos podem ser preenchidos diretamente na tela antes de exportar em PDF.
        </div>

        <ContractDocument draft={draft} onChange={setDraft} />

        <div className="precontrato-bottom-actions">
          <Link to="/ensaios" className="precontrato-btn-outline">Voltar para ensaios</Link>
          <button type="button" className="precontrato-btn-gold" onClick={handleExportPDF}>Exportar PDF</button>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
