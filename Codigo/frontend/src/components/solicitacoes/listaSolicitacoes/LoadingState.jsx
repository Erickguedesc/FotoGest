export default function LoadingState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1C1C1E] p-10 text-center text-white/55">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[var(--gold)]" />
      Carregando solicitações...
    </div>
  )
}
