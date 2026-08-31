export default function LoadingState() {
  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_14px_34px_rgba(92,82,72,0.08)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex animate-pulse items-center gap-4 border-b border-[var(--border)] py-4 last:border-b-0">
          <div className="h-12 w-28 rounded-[8px] bg-[rgba(92,82,72,0.10)]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-48 rounded bg-[rgba(92,82,72,0.12)]" />
            <div className="h-2 w-28 rounded bg-[rgba(92,82,72,0.08)]" />
          </div>
          <div className="h-3 w-20 rounded bg-[rgba(92,82,72,0.12)]" />
          <div className="h-3 w-24 rounded bg-[rgba(92,82,72,0.12)]" />
        </div>
      ))}
    </div>
  )
}
