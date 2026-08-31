import { BarChart3, Camera, Image, SlidersHorizontal, Wallet } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'

const toNumber = (value) => Number(value || 0)

const formatPercent = (value) =>
  `${value.toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })}%`

export default function RelatorioResumoConsolidado({ relatorio, tituloFallback }) {
  const recebido = toNumber(relatorio?.valorRecebido)
  const aReceber = toNumber(relatorio?.valorPendente)
  const previsto = toNumber(relatorio?.totalLiquido)
  const taxaRecebimento = previsto > 0 ? (recebido / previsto) * 100 : 0
  const taxaAReceber = previsto > 0 ? (aReceber / previsto) * 100 : 0
  const progressoRecebido = Math.min(100, Math.max(0, taxaRecebimento))
  const periodo = relatorio?.periodoDescricao || tituloFallback

  return (
    <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr] xl:items-stretch">
      <article className="rounded-[18px] border border-[#e7ded3] bg-white p-5 shadow-[0_14px_36px_rgba(82,58,35,0.055)] sm:p-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex min-w-0 gap-3">
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f0d7ad] bg-[#fff8ec] text-[#bd7920]">
              <BarChart3 size={18} />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a96d1f]">
                Resumo financeiro
              </p>

              <p className="mt-2 truncate text-sm font-medium text-[#756a61]">
                {periodo?.replace(' - ', ' · ')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:divide-x md:divide-[#eee7df]">
          <FinancialMetric
            icon={<Wallet size={16} />}
            label="Recebido"
            value={formatMoney(recebido)}
            detail={`${formatPercent(taxaRecebimento)} do previsto`}
            valueClassName="text-green-700"
          />

          <FinancialMetric
            icon={<Wallet size={16} />}
            label="A receber"
            value={formatMoney(aReceber)}
            detail={`${formatPercent(taxaAReceber)} do previsto`}
            valueClassName="text-[#b5741d]"
          />

          <FinancialMetric
            icon={<span className="text-sm font-semibold leading-none">%</span>}
            label="Taxa de recebimento"
            value={formatPercent(taxaRecebimento)}
            detail="Recebido sobre previsto"
            valueClassName="text-[#2b2520]"
          />
        </div>

        <div className="mt-8 border-t border-[#eee7df] pt-6">
          <div className="h-3 overflow-hidden rounded-full bg-[#ebe6df]">
            <div
              className="h-full rounded-full bg-green-700/75 transition-all"
              style={{ width: `${progressoRecebido}%` }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 text-sm text-[#756a61] sm:flex-row sm:items-center sm:justify-between">
            <span>{formatMoney(recebido)} recebidos</span>
            <span>{formatMoney(previsto)} previsto</span>
          </div>
        </div>
      </article>

      <article className="rounded-[18px] border border-[#e7ded3] bg-white p-5 shadow-[0_14px_36px_rgba(82,58,35,0.055)] sm:p-6">
        <div className="mb-7 flex items-start gap-3">
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f0d7ad] bg-[#fff8ec] text-[#bd7920]">
            <Image size={18} />
          </span>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a96d1f]">
              Composição do previsto
            </p>

            <p className="mt-2 text-sm text-[#756a61]">
              De onde vem o valor total
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <CompositionRow
            icon={<Camera size={17} />}
            label="Pacotes"
            value={formatMoney(relatorio?.faturamentoBruto)}
          />

          <CompositionRow
            icon={<Image size={17} />}
            label="Fotos extras"
            value={`${formatMoney(relatorio?.excedentesCobrados)} · ${relatorio?.fotosExtrasVendidas || 0} foto${
              relatorio?.fotosExtrasVendidas === 1 ? '' : 's'
            }`}
          />

          <CompositionRow
            icon={<SlidersHorizontal size={17} />}
            label="Ajustes manuais"
            value={formatMoney(relatorio?.ajustesManuais)}
          />
        </div>
      </article>
    </section>
  )
}

function FinancialMetric({ icon, label, value, detail, valueClassName }) {
  return (
    <div className="min-w-0 md:px-5 md:first:pl-0 md:last:pr-0">
      <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#eee4d9] bg-[#faf6ef] text-[#7c7167]">
        {icon}
      </span>

      <p className="text-sm font-medium text-[#756a61]">
        {label}
      </p>

      <p className={`mt-2 break-words text-3xl font-semibold leading-none tracking-normal ${valueClassName}`}>
        {value}
      </p>

      <p className="mt-2 text-xs text-[#8b8076]">
        {detail}
      </p>
    </div>
  )
}

function CompositionRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eee7df] py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f2eb] text-[#7c7167]">
          {icon}
        </span>

        <span className="truncate text-sm font-medium text-[#756a61]">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-right text-base font-semibold text-[#211b17]">
        {value}
      </span>
    </div>
  )
}
