import Icon from './Icon'

export default function BaseModal({ open, title, children, footer, onClose, maxWidth = 'max-w-[520px]' }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm animate-[fadeUp_0.22s_ease_both]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}
    >
      <div className={`w-full ${maxWidth} overflow-hidden rounded-2xl border border-white/[0.10] bg-[#181818] shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <h2 className="font-serif text-[24px] font-light tracking-[0.06em] text-white">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] text-white/35 transition hover:border-red-400/40 hover:text-red-300">
            <Icon name="close" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-white/[0.08] px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
