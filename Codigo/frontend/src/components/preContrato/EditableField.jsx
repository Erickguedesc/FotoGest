export default function EditableField({ value, onChange, multiline = false, className = '', placeholder = 'Preencher', readOnly = false }) {
  const commonClass = `w-full resize-none rounded-md border border-transparent bg-transparent px-0 py-0 text-inherit outline-none transition placeholder:text-white/25 ${readOnly ? 'cursor-default' : 'hover:border-white/10 hover:bg-white/[0.025] focus:border-[var(--gold-border)] focus:bg-[var(--gold-dim)] focus:px-2 focus:py-1'} ${className}`

  if (multiline) {
    return (
      <textarea
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        readOnly={readOnly}
        className={commonClass}
      />
    )
  }

  return (
    <input
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={commonClass}
    />
  )
}
