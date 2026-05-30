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

export default function RelatoriosPage() {
  const anoAtual = new Date().getFullYear()

  const [tipo, setTipo] = useState('MENSAL')
  const [ano, setAno] = useState(anoAtual)
  const [relatorio, setRelatorio] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const anosDisponiveis = useMemo(() => getAnosDisponiveis(), [])

  const periodos = relatorio?.periodos || []

  async function carregarRelatorio() {
    try {
      setLoading(true)
      setErro('')

      const resultado = await relatoriosService.buscarFaturamento({
        tipo,
        ano,
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

  const tituloFallback = `${getTipoPeriodoLabel(tipo)} - ${ano}`

return (
  <>
    <Header />

    <main className="theme-page min-h-screen px-4 pt-24 pb-8 md:px-8">
      <div className="mx-auto max-w-7xl">
  <RelatorioHeader
  tipo={tipo}
  ano={ano}
  periodoDescricao={relatorio?.periodoDescricao}
/>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <RelatorioFiltros
              tipo={tipo}
              ano={ano}
              anosDisponiveis={anosDisponiveis}
              loading={loading}
              onTipoChange={setTipo}
              onAnoChange={setAno}
              onFiltrar={carregarRelatorio}
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
