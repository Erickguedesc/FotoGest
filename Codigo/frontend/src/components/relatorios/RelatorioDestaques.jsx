import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'

export default function RelatorioDestaques({ destaques }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
      <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
        Destaques
      </h2>

      <div className="space-y-4">
        <DestaqueItem
          icon={<BarChart3 size={18} />}
          label="Melhor período"
          value={destaques?.melhorPeriodo || '—'}
          variant="gold"
        />

        <DestaqueItem
          icon={<TrendingUp size={18} />}
          label="Maior receita"
          value={formatMoney(destaques?.maiorReceita)}
          variant="green"
        />

        <DestaqueItem
          icon={<TrendingDown size={18} />}
          label="Menor receita"
          value={formatMoney(destaques?.menorReceita)}
          variant="red"
        />
      </div>
    </section>
  )
}

function DestaqueItem({ icon, label, value, variant }) {
  const variants = {
    gold: 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]',
    green: 'border-green-400/20 bg-green-400/10 text-green-300',
    red: 'border-red-400/20 bg-red-400/10 text-red-300',
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`rounded-xl border p-2 ${variants[variant]}`}>
        {icon}
      </span>

      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-white/40">
          {label}
        </p>

        <p className="mt-1 font-serif text-xl font-light text-white">
          {value}
        </p>
      </div>
    </div>
  )
}