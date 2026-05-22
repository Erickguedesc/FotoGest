import EnsaioDashboardCard from './EnsaioDashboardCard'

export default function EnsaiosEmAndamento({
    ensaios,
}) {
    if (!ensaios?.length) {
        return (
            <section className="space-y-5">
                <div className="theme-divider flex items-center justify-between border-b pb-4">
                    <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                        Ensaios em andamento
                    </h2>
                </div>

                <div className="theme-card rounded-3xl border border-dashed py-14 text-center">
                    <h3 className="theme-title text-lg font-medium">
                        Nenhum ensaio em andamento
                    </h3>

                    <p className="theme-muted mt-2 text-sm">
                        Os ensaios ativos aparecerão aqui.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-5">
            <div className="theme-divider flex items-center justify-between border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Ensaios em andamento
                </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                {ensaios.map((ensaio) => (
                    <EnsaioDashboardCard
                        key={ensaio.id}
                        ensaio={ensaio}
                    />
                ))}
            </div>
        </section>
    )
}
