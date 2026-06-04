import { formatMoney } from '../../utils/relatoriosUtils'

export default function RelatorioResumoConsolidado({ relatorio, tituloFallback }) {
  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-gradient-to-br from-[var(--gold-dim)] to-white/[0.02] p-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/45">
            Resultado consolidado
          </p>

          <h2 className="font-serif text-2xl font-light text-white">
            {relatorio?.periodoDescricao || tituloFallback}
          </h2>

          <p className="mt-4 font-serif text-5xl font-light text-[var(--gold)]">
            {formatMoney(relatorio?.totalLiquido)}
          </p>
        </div>

        <div className="min-w-full rounded-xl border border-white/10 bg-black/20 p-5 md:min-w-[280px]">
          <DetailRow
            label="Pacotes"
            value={formatMoney(relatorio?.faturamentoBruto)}
          />

          <DetailRow
            label="Fotos extras"
            value={`${formatMoney(relatorio?.excedentesCobrados)} · ${relatorio?.fotosExtrasVendidas || 0} foto${
              relatorio?.fotosExtrasVendidas === 1 ? '' : 's'
            }`}
          />

          <DetailRow
            label="Ajustes manuais"
            value={formatMoney(relatorio?.ajustesManuais)}
          />

          <div className="my-3 h-px bg-white/10" />

          <DetailRow
            label="Total previsto"
            value={formatMoney(relatorio?.totalLiquido)}
            strong
          />

          <DetailRow
            label="Recebido"
            value={formatMoney(relatorio?.valorRecebido)}
            strong
          />

        </div>
      </div>
    </section>
  )
}

function DetailRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-6 py-1">
      <span className="text-sm text-white/45">{label}</span>

      <span
        className={`font-serif text-lg ${
          strong ? 'text-xl text-[var(--gold)]' : 'text-white'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
