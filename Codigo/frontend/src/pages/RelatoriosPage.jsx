import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import RelatorioHeader from '../components/relatorios/RelatorioHeader'
import RelatorioFiltros from '../components/relatorios/RelatorioFiltros'
import RelatorioDestaques from '../components/relatorios/RelatorioDestaques'
import RelatorioKpiGrid from '../components/relatorios/RelatorioKpiGrid'
import RelatorioGrafico from '../components/relatorios/RelatorioGrafico'
import RelatorioResumoConsolidado from '../components/relatorios/RelatorioResumoConsolidado'
import RelatorioTiposEnsaio from '../components/relatorios/RelatorioTiposEnsaio'
import RelatorioTabela from '../components/relatorios/RelatorioTabela'
import { relatoriosService } from '../services/relatoriosService'
import Header from '../components/layout/Header'
import {
  getAnosDisponiveis,
  getTipoPeriodoLabel,
} from '../utils/relatoriosUtils'

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function RelatoriosPage() {
  const anoAtual = new Date().getFullYear()

  const [tipo, setTipo] = useState('MENSAL')
  const [ano, setAno] = useState(anoAtual)
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    tipo: 'MENSAL',
    ano: anoAtual,
    dataInicio: '',
    dataFim: '',
  })
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [relatorio, setRelatorio] = useState(null)
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [erro, setErro] = useState('')

  const anosDisponiveis = useMemo(() => getAnosDisponiveis(), [])

  const periodos = relatorio?.periodos || []

  async function carregarRelatorio(filtros = filtrosAplicados) {
    try {
      setLoading(true)
      setErro('')

      const resultado = await relatoriosService.buscarFaturamento({
        tipo: filtros.tipo,
        ano: filtros.ano,
        dataInicio: filtros.dataInicio || undefined,
        dataFim: filtros.dataFim || undefined,
      })

      setRelatorio(resultado?.data ?? resultado)
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)

      if (error.response?.status === 401 || error.response?.status === 403) {
        setErro('Sessão expirada ou acesso não autorizado. Faça login novamente.')
        return
      }

      setErro('Não foi possível carregar o relatório de valores.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarRelatorio()
  }, [])

  function aplicarFiltros(nextFiltros) {
    setFiltrosAplicados(nextFiltros)
    carregarRelatorio(nextFiltros)
  }

  function handleTipoChange(nextTipo) {
    setTipo(nextTipo)
    aplicarFiltros({
      ...filtrosAplicados,
      tipo: nextTipo,
      dataInicio: '',
      dataFim: '',
    })
  }

  function handleAnoChange(nextAno) {
    setAno(nextAno)
    aplicarFiltros({
      ...filtrosAplicados,
      ano: nextAno,
      dataInicio: '',
      dataFim: '',
    })
  }

  function handleFiltrarDatas() {
    aplicarFiltros({
      tipo,
      ano,
      dataInicio,
      dataFim,
    })
  }

  function handleLimparDatas() {
    setDataInicio('')
    setDataFim('')
    aplicarFiltros({
      tipo,
      ano,
      dataInicio: '',
      dataFim: '',
    })
  }

  const tituloFallback = `${getTipoPeriodoLabel(filtrosAplicados.tipo)} - ${filtrosAplicados.ano}`
  const tituloRelatorio = relatorio?.periodoDescricao || tituloFallback

  const handleExportPdf = async () => {
    if (!relatorio || exportLoading) return

    const slug = String(tituloRelatorio)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

    try {
      setExportLoading(true)
      setErro('')

      const response = await relatoriosService.exportarFaturamentoPdf({
        tipo: filtrosAplicados.tipo,
        ano: filtrosAplicados.ano,
        dataInicio: filtrosAplicados.dataInicio || undefined,
        dataFim: filtrosAplicados.dataFim || undefined,
      })

      downloadBlob(
        response.data,
        `relatorio-fotolhar-${slug || ano}.pdf`
      )
    } catch (error) {
      console.error('Erro ao exportar relatorio em PDF:', error)
      setErro('Nao foi possivel exportar o relatorio em PDF.')
    } finally {
      setExportLoading(false)
    }
  }

return (
  <>
    <Header />

    <main className="theme-page min-h-screen px-4 pt-24 pb-8 md:px-8">
      <div className="mx-auto max-w-7xl">
  <RelatorioHeader
  tipo={filtrosAplicados.tipo}
  ano={filtrosAplicados.ano}
  periodoDescricao={relatorio?.periodoDescricao}
/>

        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!relatorio || loading || exportLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-dim)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)] transition hover:bg-[rgba(201,164,89,0.16)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            {exportLoading ? 'Gerando PDF' : 'Exportar PDF'}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <RelatorioFiltros
              tipo={tipo}
              ano={ano}
              dataInicio={dataInicio}
              dataFim={dataFim}
              anosDisponiveis={anosDisponiveis}
              loading={loading}
              onTipoChange={handleTipoChange}
              onAnoChange={handleAnoChange}
              onDataInicioChange={setDataInicio}
              onDataFimChange={setDataFim}
              onLimparDatas={handleLimparDatas}
              onFiltrar={handleFiltrarDatas}
            />

            <RelatorioDestaques
              destaques={relatorio?.destaques}
              periodos={periodos}
            />
          </aside>

          <section className="space-y-6">
            {erro && (
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200">
                {erro}
              </div>
            )}

            <RelatorioKpiGrid relatorio={relatorio} />

            <RelatorioGrafico periodos={periodos} loading={loading} />

            <RelatorioResumoConsolidado
              relatorio={relatorio}
              tituloFallback={tituloFallback}
            />

            <RelatorioTiposEnsaio tipos={relatorio?.tiposEnsaio} />

            <RelatorioTabela periodos={periodos} />
          </section>
        </div>
      </div>
    </main>
  </>
)
}
