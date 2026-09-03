import { Download } from 'lucide-react'

export default function RelatorioHeader({
  disabled,
  exportLoading,
  onExportPdf,
}) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
      <div className="max-w-3xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b5741d]">
          Análise de valores
        </p>

        <h1 className="font-serif text-4xl font-light leading-tight text-[#1f1a16] md:text-5xl">
          Relatório financeiro
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d6258]">
          Acompanhe o previsto, o recebido e o que falta receber por período,
          com agrupamentos para enxergar tendências.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onExportPdf}
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#C84F32] px-5 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_22px_rgba(200,79,50,0.18)] transition hover:bg-[#AE3F28] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Download size={15} />
          {exportLoading ? 'Gerando PDF' : 'Exportar PDF'}
        </button>
      </div>
    </header>
  )
}
