export default function SelectionSuccessModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0806]/85 p-5 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-[#2a2420] bg-[#1a1612] p-8 text-center text-[#e8dfd4] shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5a9468]/15 text-3xl text-[#7db88a]">
          ✓
        </div>

        <h2 className="font-serif text-3xl font-light">
          Seleção confirmada!
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#887e74]">
          Suas fotos favoritas foram enviadas para a fotógrafa. A seleção não
          poderá mais ser alterada por aqui.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-full bg-[#a8783a] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:opacity-90"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
