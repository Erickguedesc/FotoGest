import { formatMoney } from '../../../services/galeriaUtils'

export default function ConfirmSelectionModal({
  open,
  totalSelecionadas,
  limite,
  excedente,
  cobraFotoExtra,
  valorExcedente,
  enviando,
  onCancel,
  onConfirm,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0806]/85 p-5 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-[#2a2420] bg-[#1a1612] p-8 text-center text-[#e8dfd4] shadow-2xl">
        <div className="mb-3 text-4xl">▣</div>
        <h2 className="font-serif text-3xl font-light">
          Deseja finalizar?
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#887e74]">
          Após confirmar, sua seleção será enviada à fotógrafa e não poderá ser alterada.
        </p>

        <div className="my-6 rounded-2xl border border-[#2a2420] bg-white/[0.03] p-4">
          <div className="flex justify-between border-b border-white/5 py-2 text-sm text-[#887e74]">
            <span>Fotos selecionadas</span>
            <strong className="text-[#e8dfd4]">{totalSelecionadas}</strong>
          </div>
          <div className="flex justify-between border-b border-white/5 py-2 text-sm text-[#887e74]">
            <span>Incluídas no pacote</span>
            <strong className="text-[#e8dfd4]">{limite}</strong>
          </div>
          <div className="flex justify-between py-2 text-sm text-[#887e74]">
            <span>Valor adicional</span>
            <strong className={excedente > 0 ? 'text-[#df7070]' : 'text-[#e8dfd4]'}>
              {excedente > 0
                ? cobraFotoExtra
                  ? formatMoney(valorExcedente)
                  : 'A combinar'
                : formatMoney(0)}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#2a2420] px-5 py-4 text-xs uppercase tracking-[0.12em] text-[#887e74] transition hover:bg-white/5 hover:text-[#e8dfd4]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={enviando}
            className="rounded-full bg-[#a8783a] px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {enviando ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
