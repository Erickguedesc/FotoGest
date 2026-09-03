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
      <div className="flex min-h-0 flex-col space-y-3 xl:h-full xl:border-r xl:border-[#EEEAE7] xl:pr-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C84F32]">
          Agrupar por
        </h2>

        <div className="theme-scrollbar grid min-h-0 gap-2 sm:grid-cols-2 xl:flex-1 xl:grid-cols-1 xl:overflow-y-auto xl:pr-1">
          {TIPOS_PERIODO.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onTipoChange(item.value)}
              className={`flex min-h-[42px] w-full items-center justify-between rounded-[9px] border px-3.5 py-2.5 text-left text-sm transition ${
                tipo === item.value
                  ? 'border-[#C84F32] bg-[#F8EDE8] text-[#C84F32] shadow-[0_6px_14px_rgba(200,79,50,0.08)]'
                  : 'border-[#E8E3DF] bg-white text-[#1F1F21] hover:border-[#C84F32] hover:text-[#C84F32]'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[11px] text-[#96928E]">{item.detalhe}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-col space-y-3 xl:h-full xl:border-r xl:border-[#EEEAE7] xl:pr-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C84F32]">
          Ano
        </h2>

        <div className="theme-scrollbar grid min-h-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:grid xl:flex-1 xl:grid-cols-1 xl:overflow-y-auto xl:pr-1">
          {anosDisponiveis.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onAnoChange(item)}
              className={`min-h-[36px] rounded-[8px] border px-3 py-1.5 text-[13px] font-medium transition ${
                Number(ano) === Number(item)
                  ? 'border-[#C84F32] bg-[#C84F32] text-white shadow-[0_6px_14px_rgba(200,79,50,0.14)]'
                  : 'border-[#E8E3DF] bg-white text-[#1F1F21] hover:border-[#C84F32] hover:text-[#C84F32]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-col space-y-3 xl:h-full xl:border-r xl:border-[#EEEAE7] xl:pr-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C84F32]">
          Período personalizado
        </h2>

        <div className="theme-scrollbar min-h-0 space-y-3 xl:flex-1 xl:overflow-y-auto xl:pr-1">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-[#6F6D6B]">
              Início
            </span>
            <input
              type="date"
              value={dataInicio}
              onChange={(event) => onDataInicioChange(event.target.value)}
              className="h-11 w-full rounded-[9px] border border-[#E8E3DF] bg-white px-3.5 text-sm text-[#1F1F21] outline-none transition focus:border-[#C84F32] focus:ring-4 focus:ring-[#C84F32]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-[#6F6D6B]">
              Fim
            </span>
            <input
              type="date"
              value={dataFim}
              onChange={(event) => onDataFimChange(event.target.value)}
              className="h-11 w-full rounded-[9px] border border-[#E8E3DF] bg-white px-3.5 text-sm text-[#1F1F21] outline-none transition focus:border-[#C84F32] focus:ring-4 focus:ring-[#C84F32]/10"
            />
          </label>
        </div>

        <div className="shrink-0 space-y-2">
          {(dataInicio || dataFim) && (
            <button
              type="button"
              onClick={onLimparDatas}
              className="text-left text-xs font-medium text-[#96928E] transition hover:text-[#C84F32]"
            >
              Limpar datas
            </button>
          )}

          <button
            type="button"
            onClick={onFiltrar}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[9px] bg-[#C84F32] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(200,79,50,0.14)] transition hover:bg-[#AE3F28] disabled:cursor-not-allowed disabled:opacity-60"
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
