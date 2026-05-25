export default function StatCard({
    titulo,
    valor,
    descricao,
    icon: Icon,
    destaque = false,
}) {
    return (
        <article className="theme-card rounded-3xl border p-6 shadow-2xl transition hover:border-[var(--gold-border)]">
            <div className="mb-5 flex items-center justify-between">
                <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                    {titulo}
                </p>

                <div className="rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] p-2 text-[var(--gold)]">
                    <Icon size={18} />
                </div>
            </div>

            <h2
                className={`font-serif text-5xl font-light ${destaque ? 'text-[var(--gold)]' : 'theme-title'
                    }`}
            >
                {valor}
            </h2>

            <p className="theme-muted mt-2 text-sm">
                {descricao}
            </p>
        </article>
    )
}
