export default function FotoGestIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="13" stroke="#C9A459" strokeWidth="1" />
      <circle cx="21" cy="21" r="7" stroke="#C9A459" strokeWidth="0.75" opacity="0.5" />
      <circle cx="21" cy="21" r="2.5" fill="#C9A459" />
      <line x1="21" y1="4" x2="21" y2="8" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
      <line x1="21" y1="34" x2="21" y2="38" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
      <line x1="4" y1="21" x2="8" y2="21" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
      <line x1="34" y1="21" x2="38" y2="21" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
