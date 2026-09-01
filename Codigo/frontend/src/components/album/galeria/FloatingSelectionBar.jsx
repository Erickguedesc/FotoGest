export default function FloatingSelectionBar({
  visible,
  totalSelecionadas,
  excedente,
  onViewSelection,
}) {
  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-[#2a2420] bg-[#1a1612] px-4 py-3 text-[#e8dfd4] shadow-2xl">
      <div className="flex items-center gap-4">
        <span className="text-sm">
          <strong>{totalSelecionadas}</strong> selecionada
          {totalSelecionadas > 1 ? 's' : ''}
        </span>
        {excedente > 0 ? (
          <span className="rounded-full bg-[#bf4f4f]/15 px-3 py-1 text-xs text-[#df7070]">
            +{excedente} excedente
          </span>
        ) : null}
        <button
          type="button"
          onClick={onViewSelection}
          className="rounded-full bg-[#C84F32] px-5 py-2 text-xs uppercase tracking-[0.12em] text-white"
        >
          Ver seleção →
        </button>
      </div>
    </div>
  )
}
