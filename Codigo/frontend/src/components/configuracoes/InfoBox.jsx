export default function InfoBox({ title, description, items = [] }) {
  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/45">
        {description}
      </p>

      {items.length > 0 && (
        <ul className="mt-4 grid gap-2 text-sm text-white/45">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}