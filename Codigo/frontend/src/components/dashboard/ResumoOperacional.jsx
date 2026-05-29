export default function ResumoOperacional({ dashboard }) {
    return (
        <section className="space-y-5">
            <div className="theme-divider border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Resumo de Ensaios
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <Metric
                    label="Hoje"
                    value={dashboard?.ensaiosHoje || 0}
                    highlight
                />

                <Metric
                    label="Próximos 7 dias"
                    value={dashboard?.ensaiosProximosSeteDias || 0}
                />

                <Metric
                    label="Sem fotos enviadas"
                    value={dashboard?.ensaiosSemFotosEnviadas || 0}
                />

                <Metric
                    label="Finalizados no mês"
                    value={dashboard?.ensaiosFinalizadosMes || 0}
                />
            </div>
        </section>
    )
}

function Metric({ label, value, highlight = false }) {
    return (
        <div className={`theme-card rounded-3xl border p-6 ${highlight ? 'border-[var(--gold-border)]' : ''}`}>
            <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                {label}
            </p>

            <h2 className={`mt-3 font-serif text-5xl font-light ${highlight ? 'text-[var(--gold)]' : 'theme-title'}`}>
                {value}
            </h2>
        </div>
    )
}
