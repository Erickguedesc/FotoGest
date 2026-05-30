import { getTipoPeriodoLabel } from '../../utils/relatoriosUtils'

export default function RelatorioHeader({ tipo, ano, periodoDescricao }) {
    return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
           Análise de valores
        </p>

        <h1 className="font-serif text-4xl font-light tracking-wide text-white md:text-5xl">
          Relatório de Valores Previstos
        </h1>
<p className="mt-3 max-w-2xl text-sm text-white/50">
  Acompanhe uma referência de valores com base em ensaios entregues, pacotes,
  fotos extras e acordos finais informados fora da plataforma.
</p>
<p className="mt-2 max-w-2xl text-xs text-white/35">
  O relatório considera apenas ensaios marcados como entregues, entendendo que
  nessa etapa o serviço foi concluído e os valores principais já foram definidos.
  Quando houver valor final informado no ensaio, ele entra como ajuste manual
  sobre a referência automática de pacote e fotos extras.
</p>
      </div>

      <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
{periodoDescricao || `${getTipoPeriodoLabel(tipo)} · ${ano}`}
      </div>
    </div>
  )
}
