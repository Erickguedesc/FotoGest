import { CalendarDays, Download } from 'lucide-react'
import { TIPOS_PERIODO, getTipoPeriodoLabel } from '../../utils/relatoriosUtils'

export default function RelatorioHeader({
  tipo,
  ano,
  periodoDescricao,
  anosDisponiveis = [],
  disabled,
  exportLoading,
  onExportPdf,
  onPeriodoResumoChange,
}) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
      <div className="max-w-3xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b5741d]">
          Análise de valores
        </p>

        <h1 className="font-serif text-4xl font-light leading-tight text-[#1f1a16] md:text-5xl">
          Relatório de Valores Previstos
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d6258]">
          Acompanhe valores previstos e recebidos conforme os ensaios, pacotes,
          fotos extras e acordos finais informados.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <label className="relative">
          <span className="sr-only">Período atual</span>
          <CalendarDays
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7066]"
          />
          <select
            value={`${tipo}|${ano}`}
            onChange={(event) => onPeriodoResumoChange(event.target.value)}
            disabled={disabled}
            className="h-11 w-full appearance-none rounded-[10px] border border-[#ded4c8] bg-white px-10 pr-11 text-sm font-medium text-[#342b24] outline-none transition focus:border-[#bf812b] focus:ring-4 focus:ring-[#c8872b]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-[220px]"
            title={periodoDescricao || `${getTipoPeriodoLabel(tipo)} · ${ano}`}
          >
            {anosDisponiveis.flatMap((anoItem) =>
              TIPOS_PERIODO.map((periodo) => (
                <option key={`${periodo.value}|${anoItem}`} value={`${periodo.value}|${anoItem}`}>
                  {getTipoPeriodoLabel(periodo.value)} · {anoItem}
                </option>
              )),
            )}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7066]">
            ▾
          </span>
        </label>

        <button
          type="button"
          onClick={onExportPdf}
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#bd7920] px-5 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_22px_rgba(189,121,32,0.22)] transition hover:bg-[#a96718] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Download size={15} />
          {exportLoading ? 'Gerando PDF' : 'Exportar PDF'}
        </button>
      </div>
    </header>
  )
}
