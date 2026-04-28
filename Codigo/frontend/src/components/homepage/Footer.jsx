export default function Footer() {
  return (
    <footer className="px-[10%] py-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#080808]">
      <span className="text-[11px] text-[var(--text-muted)] tracking-[0.1em]">
        © 2026 OLHARI — TODOS OS DIREITOS RESERVADOS
      </span>

      <a
        href="/Login"
        className="no-underline flex items-center gap-2 text-[11px] text-[var(--text-muted)] uppercase tracking-[0.1em] transition-colors duration-300 hover:text-[var(--gold)] group"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="group-hover:stroke-[var(--gold)] transition-colors"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Área Administrativa
      </a>
    </footer>
  )
}