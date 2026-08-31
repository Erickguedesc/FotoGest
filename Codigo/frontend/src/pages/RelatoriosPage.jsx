import { useEffect, useMemo, useState } from 'react'
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
    setDataInicio('')
    setDataFim('')
    aplicarFiltros({
      ...filtrosAplicados,
      tipo: nextTipo,
      dataInicio: '',
      dataFim: '',
    })
  }

  function handleAnoChange(nextAno) {
    setAno(nextAno)
    setDataInicio('')
    setDataFim('')
    aplicarFiltros({
      ...filtrosAplicados,
      ano: nextAno,
      dataInicio: '',
      dataFim: '',
    })
  }

  function handlePeriodoResumoChange(value) {
    const [nextTipo, nextAno] = value.split('|')
    const anoNumerico = Number(nextAno)

    setTipo(nextTipo)
    setAno(anoNumerico)
    setDataInicio('')
    setDataFim('')
    aplicarFiltros({
      ...filtrosAplicados,
      tipo: nextTipo,
      ano: anoNumerico,
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

    <main className="relatorios-page min-h-screen overflow-x-hidden bg-[#f8f5ef] px-4 pb-10 pt-20 text-[#211b17] md:px-6 lg:px-8 xl:px-10">
      <div className="w-full max-w-[1480px]">
        <RelatorioHeader
          tipo={filtrosAplicados.tipo}
          ano={filtrosAplicados.ano}
          periodoDescricao={relatorio?.periodoDescricao}
          anosDisponiveis={anosDisponiveis}
          disabled={!relatorio || loading || exportLoading}
          exportLoading={exportLoading}
          onExportPdf={handleExportPdf}
          onPeriodoResumoChange={handlePeriodoResumoChange}
        />

        <section className="mb-5 grid gap-5 rounded-[18px] border border-[#e7ded3] bg-white/92 p-4 shadow-[0_16px_46px_rgba(82,58,35,0.07)] backdrop-blur sm:p-5 md:grid-cols-2 xl:grid-cols-[1fr_0.85fr_1.35fr_1.45fr]">
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
        </section>

        <section className="space-y-5">
            {erro && (
              <div className="rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
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
    </main>
  </>
)
}
