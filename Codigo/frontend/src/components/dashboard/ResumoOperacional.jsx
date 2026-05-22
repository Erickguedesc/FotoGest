export default function ResumoOperacional({
    dashboard,
}) {
    return (
        <section className="space-y-5">
            <div className="theme-divider border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Resumo operacional
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="theme-card rounded-3xl border p-6">
                    <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                        Ensaios Finalizados
                    </p>

                    <h2 className="theme-title mt-3 font-serif text-5xl font-light">
                        {dashboard?.ensaiosFinalizadosMes || 0}
                    </h2>
                </div>

                <div className="theme-card rounded-3xl border p-6">
                    <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                        Solicitações totais
                    </p>

                    <h2 className="theme-title mt-3 font-serif text-5xl font-light">
                        {dashboard?.solicitacoesRecebidasMes || 0}
                    </h2>
                </div>

                <div className="theme-card rounded-3xl border border-[var(--gold-border)] p-6">
                    <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                        Seleções enviadas
                    </p>

                    <h2 className="mt-3 font-serif text-5xl font-light text-[var(--gold)]">
                        {dashboard?.selecoesEnviadas || 0}
                    </h2>
                </div>
            </div>
        </section>
    )
}
