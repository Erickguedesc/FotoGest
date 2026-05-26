import { formatMoney } from '../../../services/galeriaUtils'

export default function SelectionSummary({
  totalSelecionadas,
  limite,
  excedente,
  cobraFotoExtra,
  valorFotoExtra,
  valorExcedente,
  progresso,
  erroEnvio,
  enviando,
  selecaoEnviada,
  onOpenConfirm,
}) {
  return (
    <aside className="sticky top-24 overflow-hidden rounded-2xl border border-[#2a2420] bg-[#1a1612] text-[#e8dfd4]">
      <div className="flex items-center justify-between border-b border-[#2a2420] px-7 py-6">
        <h3 className="font-serif text-2xl font-light">
          Resumo da seleção
        </h3>
        <span
          className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.12em] ${
            totalSelecionadas === 0
              ? 'border-white/10 bg-white/5 text-[#887e74]'
              : excedente > 0
                ? 'border-[#df7070]/30 bg-[#df7070]/10 text-[#df7070]'
                : 'border-[#7db88a]/30 bg-[#7db88a]/10 text-[#7db88a]'
          }`}
        >
          {totalSelecionadas === 0
            ? 'Nenhuma foto'
            : excedente > 0
              ? `${excedente} extra`
              : 'Dentro do limite'}
        </span>
      </div>

      <div className="divide-y divide-[#2a2420]">
        <div className="flex items-center justify-between px-7 py-4">
          <span className="text-xs uppercase tracking-[0.14em] text-[#887e74]">
            Selecionadas
          </span>
          <strong className="font-serif text-3xl font-light text-[#c9a96e]">
            {totalSelecionadas}
          </strong>
        </div>

        <div className="flex items-center justify-between px-7 py-4">
          <span className="text-xs uppercase tracking-[0.14em] text-[#887e74]">
            Limite do pacote
          </span>
          <strong className="font-serif text-3xl font-light">
            {limite}
          </strong>
        </div>

        <div className="flex items-center justify-between px-7 py-4">
          <span className="text-xs uppercase tracking-[0.14em] text-[#887e74]">
            Excedente
          </span>
          <strong
            className={`font-serif text-3xl font-light ${
              excedente > 0 ? 'text-[#df7070]' : ''
            }`}
          >
            {excedente > 0 ? `+${excedente}` : '—'}
          </strong>
        </div>
      </div>

      <div className="border-b border-[#2a2420] px-7 py-5">
        <div className="mb-3 flex justify-between text-[11px] uppercase tracking-[0.14em] text-[#887e74]">
          <span>Progresso</span>
          <span>{progresso}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#2a2420]">
          <div
            className={`h-full rounded-full transition-all ${
              excedente > 0 ? 'bg-[#df7070]' : 'bg-[#c9a96e]'
            }`}
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {excedente > 0 ? (
        <div className="border-b border-[#bf4f4f]/20 bg-[#bf4f4f]/10 px-7 py-5">
          <p className="text-sm leading-6 text-[#df7070]/80">
            Você selecionou <strong>{excedente}</strong> foto(s) extras.{' '}
            {cobraFotoExtra ? (
              <>
                Cada uma custa <strong>{formatMoney(valorFotoExtra)}</strong>.
              </>
            ) : (
              <>
                O valor adicional será combinado diretamente com a fotógrafa.
              </>
            )}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#df7070]/50">
            Valor adicional
          </p>
          <strong className="font-serif text-4xl font-light text-[#df7070]">
            {cobraFotoExtra ? formatMoney(valorExcedente) : 'A combinar'}
          </strong>
        </div>
      ) : totalSelecionadas > 0 ? (
        <div className="border-b border-[#5a9468]/20 px-7 py-4 text-sm text-[#7db88a]">
          ✓ Dentro do pacote. Nenhum custo adicional.
        </div>
      ) : null}

      <div className="px-7 py-6">
        {erroEnvio ? (
          <p className="mb-3 rounded-xl border border-[#df7070]/20 bg-[#df7070]/10 px-4 py-3 text-sm text-[#df7070]">
            {erroEnvio}
          </p>
        ) : null}

        <button
          type="button"
          disabled={totalSelecionadas === 0 || enviando || selecaoEnviada}
          onClick={onOpenConfirm}
          className="w-full rounded-full bg-[#a8783a] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-lg shadow-[#a8783a]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {selecaoEnviada ? 'Seleção já enviada' : 'Confirmar seleção'}
        </button>

        <p className="mt-3 text-center text-xs text-[#887e74]">
          {totalSelecionadas === 0
            ? 'Selecione fotos para confirmar'
            : excedente > 0
              ? cobraFotoExtra
                ? `Valor extra de ${formatMoney(valorExcedente)}`
                : 'Valor extra a combinar'
              : 'Tudo certo para enviar'}
        </p>
      </div>
    </aside>
  )
}
