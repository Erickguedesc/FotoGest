import { BarChart3, Camera, TrendingDown, TrendingUp } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'
import { getTipoLabel } from '../ensaios/listaEnsaios/ensaioHelpers'

export default function RelatorioDestaques({ destaques, periodos = [] }) {
  const periodosComReceita = periodos.filter(
    (periodo) => Number(periodo?.totalLiquido || 0) > 0,
  )
  const temComparacaoInterna = periodosComReceita.length > 1
  const comparacaoLabel = periodosComReceita.length === 0
    ? 'Sem receita'
    : 'Apenas 1 período com receita'
  const quantidadeTipo = Number(destaques?.quantidadeTipoMaisRealizado || 0)
  const tipoMaisRealizado = destaques?.tipoMaisRealizado
  const tipoMaisRealizadoExibicao = destaques?.tipoMaisRealizadoExibicao
  const tipoMaisRealizadoLabel = tipoMaisRealizado
    ? `${tipoMaisRealizadoExibicao || getTipoLabel(tipoMaisRealizado)} · ${quantidadeTipo} ensaio${quantidadeTipo === 1 ? '' : 's'}`
    : 'Sem ensaios'
  const melhorPeriodoLabel = periodosComReceita.length > 0
    ? destaques?.melhorPeriodo || '—'
    : 'Sem receita'

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
      <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
        Destaques
      </h2>

      <div className="space-y-4">
        <DestaqueItem
          icon={<BarChart3 size={18} />}
          label="Melhor período"
          value={melhorPeriodoLabel}
          variant={periodosComReceita.length > 0 ? 'gold' : 'neutral'}
        />

        <DestaqueItem
          icon={<TrendingUp size={18} />}
          label="Maior valor"
          value={formatMoney(destaques?.maiorReceita)}
          variant="green"
        />

        <DestaqueItem
          icon={<TrendingDown size={18} />}
          label="Menor valor"
          value={temComparacaoInterna ? formatMoney(destaques?.menorReceita) : comparacaoLabel}
          variant={temComparacaoInterna ? 'red' : 'neutral'}
        />

        <DestaqueItem
          icon={<Camera size={18} />}
          label="Tipo mais realizado"
          value={tipoMaisRealizadoLabel}
          variant="blue"
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
    blue: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
    neutral: 'border-white/10 bg-white/[0.04] text-white/45',
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
