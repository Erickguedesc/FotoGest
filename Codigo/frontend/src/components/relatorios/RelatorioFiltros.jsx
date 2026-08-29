import { Calendar, Loader2 } from 'lucide-react'
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
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
          Período
        </h2>

        <div className="space-y-2">
          {TIPOS_PERIODO.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onTipoChange(item.value)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                tipo === item.value
                  ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-white'
                  : 'border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              <span className="text-sm">{item.label}</span>
              <span className="text-xs text-white/40">{item.detalhe}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
          Ano
        </h2>

        <div className="flex flex-wrap gap-2">
          {anosDisponiveis.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onAnoChange(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                Number(ano) === Number(item)
                  ? 'border-[var(--gold)] bg-[var(--gold)] text-black'
                  : 'border-white/10 text-white/60 hover:border-[var(--gold-border)] hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
          Datas personalizadas
        </h2>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-[10.5px] uppercase tracking-[0.13em] text-white/40">
              Inicio
            </span>
            <input
              type="date"
              value={dataInicio}
              onChange={(event) => onDataInicioChange(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-transparent px-3.5 py-2.5 text-sm text-white/70 outline-none transition focus:border-[var(--gold-border)] focus:bg-white/[0.03]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10.5px] uppercase tracking-[0.13em] text-white/40">
              Fim
            </span>
            <input
              type="date"
              value={dataFim}
              onChange={(event) => onDataFimChange(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-transparent px-3.5 py-2.5 text-sm text-white/70 outline-none transition focus:border-[var(--gold-border)] focus:bg-white/[0.03]"
            />
          </label>

          {(dataInicio || dataFim) && (
            <button
              type="button"
              onClick={onLimparDatas}
              className="text-xs uppercase tracking-[0.12em] text-white/45 transition hover:text-white"
            >
              Limpar datas
            </button>
          )}

          <button
            type="button"
            onClick={onFiltrar}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Carregando
              </>
            ) : (
              <>
                <Calendar size={16} />
                Filtrar datas
              </>
            )}
          </button>
        </div>
      </section>
    </>
  )
}
