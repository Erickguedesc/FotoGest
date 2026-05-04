export default function LoadingState() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#141414] p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex animate-pulse items-center gap-4 border-b border-white/[0.06] py-4 last:border-b-0">
          <div className="h-9 w-9 rounded-full bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-48 rounded bg-white/[0.06]" />
            <div className="h-2 w-28 rounded bg-white/[0.04]" />
          </div>
          <div className="h-3 w-20 rounded bg-white/[0.06]" />
          <div className="h-3 w-24 rounded bg-white/[0.06]" />
        </div>
      ))}
    </div>
  )
}
