import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  icon = null,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#756a61]">
        {label}
      </span>

      <span className="flex min-h-12 items-center rounded-[13px] border border-[#ded4c8] bg-white text-[#211b17] transition focus-within:border-[#bf812b] focus-within:ring-4 focus-within:ring-[#c8872b]/10">
        {icon ? (
          <span className="ml-4 flex shrink-0 text-[#7d7066]">
            {icon}
          </span>
        ) : null}

        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          className={`min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#a1978f] ${
            icon ? 'px-3.5' : 'px-4'
          }`}
        />
      </span>
    </label>
  )
}

export function TextareaField({ label, name, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#756a61]">
        {label}
      </span>

      <textarea
        name={name}
        value={value ?? ''}
        onChange={onChange}
        rows={rows}
        className="w-full resize-none rounded-[13px] border border-[#ded4c8] bg-white px-4 py-3 text-sm text-[#211b17] outline-none transition placeholder:text-[#a1978f] focus:border-[#bf812b] focus:ring-4 focus:ring-[#c8872b]/10"
      />
    </label>
  )
}

export function PasswordField({ label, name, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#756a61]">
        {label}
      </span>

      <div className="flex rounded-[13px] border border-[#ded4c8] bg-white text-[#211b17] transition focus-within:border-[#bf812b] focus-within:ring-4 focus-within:ring-[#c8872b]/10">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="flex w-12 items-center justify-center text-[#756a61] transition hover:text-[#bd7920]"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  )
}
