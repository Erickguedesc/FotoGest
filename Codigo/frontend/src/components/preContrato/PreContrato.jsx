import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Toast from '../ui/Toast'
import { clientesService } from '../../services/clientesService'
import { configuracoesService } from '../../services/configuracoesService'
import { ensaiosService } from '../../services/ensaiosService'
import ContractDocument from './ContractDocument'
import LoadingState from './LoadingState'
import PreContratoBreadcrumb from './PreContratoBreadcrumb'
import PreContratoTop from './PreContratoTop'
import { applyModeloContratoToDraft, buildInitialDraft } from './preContratoHelpers'
import '../../styles/pre-contrato.css'

function escolherModeloInicial(modelos, ensaio) {
  const ativos = Array.isArray(modelos)
    ? modelos.filter((modelo) => modelo.ativo !== false)
    : []

  return (
    ativos.find((modelo) => modelo.tipoEnsaio === ensaio?.tipo && modelo.padrao) ||
    ativos.find((modelo) => !modelo.tipoEnsaio && modelo.padrao) ||
    ativos.find((modelo) => modelo.tipoEnsaio === ensaio?.tipo) ||
    ativos.find((modelo) => modelo.padrao) ||
    ativos[0]
  )
}

export default function PreContrato() {
  const { ensaioId } = useParams()

  const [draft, setDraft] = useState(null)
  const [modelosContrato, setModelosContrato] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [response, configuracoes] = await Promise.all([
          ensaiosService.buscarPorId(ensaioId),
          configuracoesService.buscar().catch((configError) => {
            console.warn('[Pre-contrato] Nao foi possivel carregar configuracoes:', configError?.response?.data || configError)
            return null
          }),
        ])
        const ensaio = response.data
        let cliente = null

        if (ensaio?.clienteId) {
          try {
            const clienteResponse = await clientesService.buscarPorId(ensaio.clienteId)
            cliente = clienteResponse.data
          } catch (clienteError) {
            console.warn('[Pre-contrato] Nao foi possivel carregar o cliente completo:', clienteError?.response?.data || clienteError)
          }
        }

        const modelos = Array.isArray(configuracoes?.modelosContrato)
          ? configuracoes.modelosContrato.filter((modelo) => modelo.ativo !== false)
          : []
        const modeloInicial = escolherModeloInicial(modelos, ensaio)
        const initialDraft = buildInitialDraft({ ensaio, cliente, configuracoes })
        const draftComModelo = modeloInicial
          ? applyModeloContratoToDraft(initialDraft, modeloInicial)
          : initialDraft

        if (active) {
          setModelosContrato(modelos)
          setDraft(draftComModelo)
        }
      } catch (err) {
        console.error('[Pre-contrato] Erro ao carregar dados:', err?.response?.data || err)

        if (active) {
          setError('Nao foi possivel carregar os dados. Voce ainda pode preencher o pre-contrato manualmente.')
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
      showToast('Link do pre-contrato copiado!')
    } catch {
      showToast('Nao foi possivel copiar o link.', 'error')
    }
  }

  const handleExportPDF = () => {
    showToast('Abrindo dialogo de impressao / salvar PDF...', 'gold')
    window.setTimeout(() => window.print(), 500)
  }

  const handleSelectModelo = (event) => {
    const modelo = modelosContrato.find((item) => item.id === event.target.value)
    if (!modelo || !draft) return

    setDraft(applyModeloContratoToDraft(draft, modelo))
    showToast(`Modelo "${modelo.nome}" aplicado.`, 'gold')
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

        {modelosContrato.length > 1 && (
          <div className="precontrato-model-selector mb-5 rounded-xl border border-[var(--pc-border)] bg-white/[0.025] p-4">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[var(--pc-text-muted)]">
                Modelo de contrato
              </span>
              <select
                value={draft.modeloContratoId || ''}
                onChange={handleSelectModelo}
                className="w-full rounded-lg border border-[var(--pc-border)] bg-transparent px-3 py-2 text-sm text-[var(--pc-text-secondary)] outline-none transition focus:border-[var(--pc-gold-border)]"
              >
                {modelosContrato.map((modelo) => (
                  <option key={modelo.id} value={modelo.id}>
                    {modelo.nome}{modelo.tipoEnsaio ? ` - ${modelo.tipoEnsaio}` : ''}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

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
