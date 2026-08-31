import { Funnel, Loader2 } from 'lucide-react'
import { TIPOS_PERIODO } from '../../utils/relatoriosUtils'

export default function RelatorioFiltros({
  tipo,
  ano,
  dataInicio,
  dataFim,
  anosDisponiveis,
  loading,
  onTipoChange,
  onAnoChange,
  onDataInicioChange,
  onDataFimChange,
  onLimparDatas,
  onFiltrar,
}) {
  return (
    <>
      <div className="space-y-3 xl:border-r xl:border-[#ece4da] xl:pr-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a96d1f]">
          Período
        </h2>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {TIPOS_PERIODO.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onTipoChange(item.value)}
              className={`flex min-h-[42px] w-full items-center justify-between rounded-[9px] border px-3.5 py-2.5 text-left text-sm transition ${
                tipo === item.value
                  ? 'border-[#c98932] bg-[#fff6e8] text-[#9b5f13] shadow-[0_6px_14px_rgba(194,124,32,0.08)]'
                  : 'border-[#e5ddd3] bg-white text-[#514740] hover:border-[#c98932] hover:text-[#9b5f13]'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[11px] text-[#9b9187]">{item.detalhe}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 xl:border-r xl:border-[#ece4da] xl:pr-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a96d1f]">
          Ano
        </h2>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:grid xl:grid-cols-1">
          {anosDisponiveis.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onAnoChange(item)}
              className={`min-h-[42px] rounded-[9px] border px-4 py-2 text-sm font-medium transition ${
                Number(ano) === Number(item)
                  ? 'border-[#bd7920] bg-[#bd7920] text-white shadow-[0_8px_18px_rgba(189,121,32,0.18)]'
                  : 'border-[#e5ddd3] bg-white text-[#61574f] hover:border-[#c98932] hover:text-[#9b5f13]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 xl:border-r xl:border-[#ece4da] xl:pr-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a96d1f]">
          Período personalizado
        </h2>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-[#7b7066]">
              Início
            </span>
            <input
              type="date"
              value={dataInicio}
              onChange={(event) => onDataInicioChange(event.target.value)}
              className="h-11 w-full rounded-[9px] border border-[#ded4c8] bg-white px-3.5 text-sm text-[#332b25] outline-none transition focus:border-[#bf812b] focus:ring-4 focus:ring-[#c8872b]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-[#7b7066]">
              Fim
            </span>
            <input
              type="date"
              value={dataFim}
              onChange={(event) => onDataFimChange(event.target.value)}
              className="h-11 w-full rounded-[9px] border border-[#ded4c8] bg-white px-3.5 text-sm text-[#332b25] outline-none transition focus:border-[#bf812b] focus:ring-4 focus:ring-[#c8872b]/10"
            />
          </label>
        </div>

        <div className="space-y-2">
          {(dataInicio || dataFim) && (
            <button
              type="button"
              onClick={onLimparDatas}
              className="text-left text-xs font-medium text-[#8b7e73] transition hover:text-[#9b5f13]"
            >
              Limpar datas
            </button>
          )}

          <button
            type="button"
            onClick={onFiltrar}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[9px] bg-[#bd7920] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(189,121,32,0.16)] transition hover:bg-[#a96718] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Carregando
              </>
            ) : (
              <>
                <Funnel size={16} />
                Filtrar datas
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
