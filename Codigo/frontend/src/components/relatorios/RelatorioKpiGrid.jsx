import { Calendar, DollarSign, ImagePlus, Users, Wallet } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'

export default function RelatorioKpiGrid({ relatorio }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <KpiCard
        title="Valor previsto total"
        value={formatMoney(relatorio?.faturamentoTotal)}
        description={relatorio?.comparativo?.descricaoFaturamento || 'Sem base comparativa'}
        tendencia={relatorio?.comparativo?.tendenciaFaturamento}
        icon={<DollarSign size={18} />}
        variant="gold"
      />

      <KpiCard
        title="Valor recebido"
        value={formatMoney(relatorio?.valorRecebido)}
        description="Ensaios entregues marcados como pagos"
        icon={<Wallet size={18} />}
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

      <KpiCard
        title="Clientes novos"
        value={relatorio?.clientesNovos ?? 0}
        description="Clientes cadastrados no período"
        icon={<Users size={18} />}
        variant="blue"
      />

      <KpiCard
        title="Fotos extras vendidas"
        value={relatorio?.fotosExtrasVendidas ?? 0}
        description={formatMoney(relatorio?.excedentesCobrados)}
        icon={<ImagePlus size={18} />}
        variant="gold"
      />

      <KpiCard
        title="Ticket médio por ensaio"
        value={formatMoney(relatorio?.ticketMedioEnsaio)}
        description="Total previsto dividido pelos ensaios entregues"
        icon={<Wallet size={18} />}
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
    gold: 'text-[#AE3F28]',
    green: 'text-green-700',
    blue: 'text-sky-700',
    white: 'text-[#2b2520]',
  }

  const iconStyle = {
    gold: 'border-[#F8EDE8] bg-[#F8EDE8] text-[#C84F32]',
    green: 'border-green-100 bg-green-50 text-green-700',
    blue: 'border-sky-100 bg-sky-50 text-sky-700',
    white: 'border-[#E8E3DF] bg-[#f7f3ed] text-[#6d6258]',
  }

  const tendenciaStyle = {
    ALTA: 'text-green-700',
    QUEDA: 'text-red-600',
    NEUTRO: 'text-[#6F6D6B]',
    SEM_BASE: 'text-[#AE3F28]',
  }

  return (
    <article className="flex min-h-[124px] flex-col rounded-[16px] border border-[#E8E3DF] bg-white p-4 shadow-[0_10px_24px_rgba(31,31,33,0.04)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="max-w-[142px] text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-[#8a7e73]">
          {title}
        </p>

        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${iconStyle[variant]}`}>
          {icon}
        </span>
      </div>

      <p className={`text-[26px] font-medium leading-none tracking-normal ${valueColor[variant]}`}>
        {value}
      </p>

      {description && (
        <p
          className={`mt-auto pt-3 text-[11px] leading-4 ${
            tendencia
              ? tendenciaStyle[tendencia] || tendenciaStyle.NEUTRO
              : 'text-[#6F6D6B]'
          }`}
        >
          {description}
        </p>
      )}
    </article>
  )
}
