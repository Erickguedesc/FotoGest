import { CheckCircle2, ShieldCheck } from 'lucide-react'

export default function InfoBox({ title, description, items = [] }) {
  return (
    <div className="rounded-[18px] border border-[#E8E3DF] bg-white p-5 shadow-[0_14px_34px_rgba(31,31,33,0.04)] sm:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F8EDE8] bg-[#F8EDE8] text-[#C84F32]">
              <ShieldCheck size={18} />
            </span>

            <div>
              <h3 className="text-base font-semibold text-[#1F1F21]">
                {title}
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#6F6D6B]">
                {description}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <ul className="mt-4 grid gap-3 text-sm text-[#6F6D6B]">
              {items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-[#C84F32]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-full border border-[#E8E3DF] bg-[#F8EDE8] text-[#C84F32] md:flex">
          <ShieldCheck size={46} strokeWidth={1.35} />
        </div>
      </div>
    </div>
  )
}
