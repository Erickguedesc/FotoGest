export default function EmptyState({ onRefresh }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1C1C1E] px-6 py-16 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl font-light text-white">Nenhuma solicitação recebida</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/45">
        Novas solicitações aparecerão aqui.
      </p>
      <button
        type="button"
        onClick={onRefresh}
        className="mt-6 rounded-lg border border-white/10 bg-transparent px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-white/60 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
      >
        Atualizar lista
      </button>
    </div>
  )
}
