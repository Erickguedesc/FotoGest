import { BarChart3, Camera, Image, SlidersHorizontal, Star, Wallet } from 'lucide-react'
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
  const ensaiosMaisRealizados = Array.isArray(relatorio?.ensaiosMaisRealizados)
    ? relatorio.ensaiosMaisRealizados
    : []

  return (
    <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr_1fr] xl:items-stretch">
      <article className="rounded-[16px] border border-[#E8E3DF] bg-white p-4 shadow-[0_12px_30px_rgba(31,31,33,0.04)] sm:p-5">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex min-w-0 gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F8EDE8] bg-[#fff8ec] text-[#C84F32]">
              <BarChart3 size={16} />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C84F32]">
                Resumo financeiro
              </p>

              <p className="mt-1.5 truncate text-[13px] font-medium text-[#6F6D6B]" title={periodo?.replace(' - ', ' · ')}>
                {periodo?.replace(' - ', ' · ')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:divide-x md:divide-[#eee7df]">
          <FinancialMetric
            icon={<Wallet size={16} />}
            label="Recebido"
            value={formatMoney(recebido)}
            detail={`${formatPercent(taxaRecebimento)} do previsto`}
            valueClassName="text-green-700"
            valueSizeClassName="text-[18px] min-[1440px]:text-[21px]"
          />

          <FinancialMetric
            icon={<Wallet size={16} />}
            label="A receber"
            value={formatMoney(aReceber)}
            detail={`${formatPercent(taxaAReceber)} do previsto`}
            valueClassName="text-[#b5741d]"
            valueSizeClassName="text-[18px] min-[1440px]:text-[20px]"
          />

          <FinancialMetric
            icon={<span className="text-sm font-semibold leading-none">%</span>}
            label="Taxa de recebimento"
            value={formatPercent(taxaRecebimento)}
            detail="Recebido sobre previsto"
            valueClassName="text-[#2b2520]"
          />
        </div>

        <div className="mt-6 border-t border-[#eee7df] pt-5">
          <div className="h-2.5 overflow-hidden rounded-full bg-[#ebe6df]">
            <div
              className="h-full rounded-full bg-green-700/75 transition-all"
              style={{ width: `${progressoRecebido}%` }}
            />
          </div>

          <div className="mt-3 flex flex-col gap-2 text-[13px] text-[#6F6D6B] sm:flex-row sm:items-center sm:justify-between">
            <span>{formatMoney(recebido)} recebidos</span>
            <span>{formatMoney(previsto)} previsto</span>
          </div>
        </div>
      </article>

      <article className="rounded-[16px] border border-[#E8E3DF] bg-white p-4 shadow-[0_12px_30px_rgba(31,31,33,0.04)] sm:p-5">
        <div className="mb-5 flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F8EDE8] bg-[#fff8ec] text-[#C84F32]">
            <Image size={16} />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C84F32]">
              Composição do previsto
            </p>

            <p className="mt-1.5 text-[13px] text-[#6F6D6B]">
              De onde vem o valor total
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <CompositionRow
            icon={<Camera size={15} />}
            label="Pacotes"
            value={formatMoney(relatorio?.faturamentoBruto)}
          />

          <CompositionRow
            icon={<Image size={15} />}
            label="Fotos extras"
            value={`${formatMoney(relatorio?.excedentesCobrados)} · ${relatorio?.fotosExtrasVendidas || 0} foto${
              relatorio?.fotosExtrasVendidas === 1 ? '' : 's'
            }`}
          />

          <CompositionRow
            icon={<SlidersHorizontal size={15} />}
            label="Ajustes manuais"
            value={formatMoney(relatorio?.ajustesManuais)}
          />
        </div>
      </article>

      <TopEnsaiosCard ensaios={ensaiosMaisRealizados} />
    </section>
  )
}

function TopEnsaiosCard({ ensaios }) {
  const ranking = Array.isArray(ensaios) ? ensaios.slice(0, 5) : []

  return (
    <article className="rounded-[16px] border border-[#E8E3DF] bg-white p-4 shadow-[0_12px_30px_rgba(31,31,33,0.04)] sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F8EDE8] bg-[#fff8ec] text-[#C84F32]">
            <Star size={15} />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C84F32]">
              Top 5 ensaios
            </p>

            <p className="mt-1.5 text-[13px] text-[#6F6D6B]">
              Tipos mais realizados no período
            </p>
          </div>
        </div>
      </div>

      {ranking.length ? (
        <div className="space-y-1">
          {ranking.map((item, index) => {
            const quantidade = Number(item?.quantidadeEnsaios || 0)

            return (
              <TopEnsaiosRow
                key={item?.tipoExibicao || item?.tipo || index}
                index={index}
                tipo={item?.tipoExibicao || item?.tipo || 'Ensaio'}
                quantidade={quantidade}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-[205px] items-center justify-center rounded-[12px] border border-dashed border-[#E8E3DF] px-4 text-center text-sm text-[#6F6D6B]">
          Ainda não há ensaios realizados suficientes no período.
        </div>
      )}
    </article>
  )
}

function TopEnsaiosRow({ index, tipo, quantidade }) {
  const isLeader = index === 0

  return (
    <div className={`grid min-h-[48px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] px-2 py-2 ${
      isLeader ? 'bg-[#fff8f0]' : 'border-b border-[#eee7df] last:border-b-0'
    }`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
        isLeader ? 'border-[#D8CFC7] bg-[#F7F3EF] text-[#4F4A45]' : 'border-[#E8E3DF] bg-white text-[#8A8580]'
      }`}>
        {index + 1}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-[#4F4A45]" title={tipo}>
          {tipo}
        </p>
      </div>

      <span className={`shrink-0 text-right text-[13px] font-semibold ${
        isLeader ? 'text-[#C84F32]' : 'text-[#6F6D6B]'
      }`}>
        {quantidade} ensaio{quantidade === 1 ? '' : 's'}
      </span>
    </div>
  )
}

function FinancialMetric({
  icon,
  label,
  value,
  detail,
  valueClassName,
  valueSizeClassName = 'text-[26px]',
}) {
  return (
    <div className="min-w-0 md:px-4 md:first:pl-0 md:last:pr-0">
      <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#eee4d9] bg-[#faf6ef] text-[#7c7167]">
        {icon}
      </span>

      <p className="text-[13px] font-medium text-[#6F6D6B]">
        {label}
      </p>

      <p className={`mt-2 whitespace-nowrap font-semibold leading-none tracking-normal ${valueSizeClassName} ${valueClassName}`}>
        {value}
      </p>

      <p className="mt-1.5 text-xs text-[#8b8076]">
        {detail}
      </p>
    </div>
  )
}

function CompositionRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eee7df] py-3.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f2eb] text-[#7c7167]">
          {icon}
        </span>

        <span className="truncate text-[13px] font-medium text-[#6F6D6B]" title={label}>
          {label}
        </span>
      </div>

      <span className="shrink-0 text-right text-[15px] font-semibold text-[#1F1F21]" title={value}>
        {value}
      </span>
    </div>
  )
}
