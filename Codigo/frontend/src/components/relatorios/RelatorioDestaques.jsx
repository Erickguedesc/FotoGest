import { Camera, Star, TrendingDown, TrendingUp } from 'lucide-react'
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
    <div className="space-y-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C84F32]">
        Destaques
      </h2>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <DestaqueItem
          icon={<Star size={15} />}
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
    </div>
  )
}

function DestaqueItem({ icon, label, value, variant }) {
  const variants = {
    gold: 'border-[#F8EDE8] bg-[#F8EDE8] text-[#C84F32]',
    green: 'border-green-100 bg-green-50 text-green-700',
    red: 'border-red-100 bg-red-50 text-red-600',
    blue: 'border-sky-100 bg-sky-50 text-sky-700',
    neutral: 'border-[#E8E3DF] bg-[#F5F3F1] text-[#96928E]',
  }

  return (
    <div className="flex min-h-[42px] items-center gap-3 rounded-[9px] border border-[#E8E3DF] bg-white px-3 py-2">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border ${variants[variant]}`}>
        {icon}
      </span>

      <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="truncate text-xs font-medium text-[#6F6D6B]" title={label}>
          {label}
        </p>

        <p className="max-w-[180px] truncate text-right text-sm font-semibold text-[#1F1F21]" title={value}>
          {value}
        </p>
      </div>
    </div>
  )
}
