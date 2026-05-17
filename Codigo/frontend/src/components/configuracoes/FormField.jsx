import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/35">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--gold-border)]"
      />
    </label>
  )
}

export function TextareaField({ label, name, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/35">
        {label}
      </span>

      <textarea
        name={name}
        value={value ?? ''}
        onChange={onChange}
        rows={rows}
        className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--gold-border)]"
      />
    </label>
  )
}

export function PasswordField({ label, name, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/35">
        {label}
      </span>

      <div className="flex rounded-xl border border-white/10 bg-black/30 transition focus-within:border-[var(--gold-border)]">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="flex w-12 items-center justify-center text-white/40 transition hover:text-[var(--gold)]"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  )
}