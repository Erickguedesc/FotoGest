import { getTipoPeriodoLabel } from '../../utils/relatoriosUtils'

export default function RelatorioHeader({ tipo, ano, periodoDescricao }) {
    return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
           Análise financeira
        </p>

        <h1 className="font-serif text-4xl font-light tracking-wide text-white md:text-5xl">
          Relatório de Faturamento
        </h1>
<p className="mt-3 max-w-2xl text-sm text-white/50">
  Acompanhe uma estimativa de faturamento com base em quantidade de ensaios
  entregues, valor do pacote do ensaio e fotos excedentes, cobradas por período.
</p>
<p className="mt-2 max-w-2xl text-xs text-white/35">
  O relatório considera apenas ensaios marcados como entregues, entendendo que
  nessa etapa o serviço foi concluído e os valores principais já foram definidos.
  Ainda assim, os valores exibidos são estimativas do sistema e podem não incluir
  acordos, descontos ou cobranças combinadas diretamente com o cliente fora da
  plataforma.
</p>
      </div>

      <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
{periodoDescricao || `${getTipoPeriodoLabel(tipo)} · ${ano}`}
      </div>
    </div>
  )
}