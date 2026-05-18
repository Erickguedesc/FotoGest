import { BarChart3, Calendar, DollarSign } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'

export default function RelatorioKpiGrid({ relatorio }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard
        title="Faturamento total"
        value={formatMoney(relatorio?.faturamentoTotal)}
        description={relatorio?.comparativo?.descricaoFaturamento || 'Sem base comparativa'}
        tendencia={relatorio?.comparativo?.tendenciaFaturamento}
        icon={<DollarSign size={18} />}
        variant="gold"
      />

      <KpiCard
        title="Média por período"
        value={formatMoney(relatorio?.mediaPorPeriodo)}
        description={`Aprox. ${formatMoney(relatorio?.mediaPorPeriodo)} / ${
          relatorio?.unidadePeriodo || 'período'
        }`}
        icon={<BarChart3 size={18} />}
        variant="green"
      />

      <KpiCard
        title="Ensaios realizados"
        value={relatorio?.ensaiosRealizados ?? 0}
        description={relatorio?.comparativo?.descricaoEnsaios || 'Sem base comparativa'}
        tendencia={relatorio?.comparativo?.tendenciaEnsaios}
        icon={<Calendar size={18} />}
        variant="white"
      />
    </div>
  )
}

function KpiCard({
  title,
  value,
  description,
  tendencia,
  icon,
  variant = 'white',
}) {
  const valueColor = {
    gold: 'text-[var(--gold)]',
    green: 'text-green-300',
    white: 'text-white',
  }

  const iconStyle = {
    gold: 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]',
    green: 'border-green-400/20 bg-green-400/10 text-green-300',
    white: 'border-white/10 bg-white/[0.03] text-white/60',
  }

  const tendenciaStyle = {
    ALTA: 'bg-green-400/10 text-green-300',
    QUEDA: 'bg-red-400/10 text-red-300',
    NEUTRO: 'bg-white/5 text-white/45',
    SEM_BASE: 'bg-[var(--gold-dim)] text-[var(--gold)]',
  }

  return (
    <article className="rounded-2xl border border-[var(--gold-border)] bg-[#111111] p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.16em] text-white/40">
          {title}
        </p>

        <span className={`rounded-full border p-2 ${iconStyle[variant]}`}>
          {icon}
        </span>
      </div>

      <p className={`font-serif text-3xl font-light ${valueColor[variant]}`}>
        {value}
      </p>

      {description && (
        <p
          className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs ${
            tendencia
              ? tendenciaStyle[tendencia] || tendenciaStyle.NEUTRO
              : 'bg-white/5 text-white/55'
          }`}
        >
          {description}
        </p>
      )}
    </article>
  )
}