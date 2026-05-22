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
      <span className="theme-muted mb-2 block text-xs uppercase tracking-[0.14em]">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className="theme-input w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--gold-border)]"
      />
    </label>
  )
}

export function TextareaField({ label, name, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="theme-muted mb-2 block text-xs uppercase tracking-[0.14em]">
        {label}
      </span>

      <textarea
        name={name}
        value={value ?? ''}
        onChange={onChange}
        rows={rows}
        className="theme-input w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--gold-border)]"
      />
    </label>
  )
}

export function PasswordField({ label, name, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="theme-muted mb-2 block text-xs uppercase tracking-[0.14em]">
        {label}
      </span>

      <div className="theme-input flex rounded-xl border transition focus-within:border-[var(--gold-border)]">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[var(--text)] outline-none"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="theme-muted flex w-12 items-center justify-center transition hover:text-[var(--gold)]"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  )
}
