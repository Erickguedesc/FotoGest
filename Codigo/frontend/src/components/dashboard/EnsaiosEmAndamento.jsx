import EnsaioDashboardCard from './EnsaioDashboardCard'

export default function EnsaiosEmAndamento({
    ensaios,
}) {
    if (!ensaios?.length) {
        return (
            <section className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                        Ensaios em andamento
                    </h2>
                </div>

                <div className="rounded-3xl border border-dashed border-white/10 py-14 text-center">
                    <h3 className="text-lg font-medium text-white">
                        Nenhum ensaio em andamento
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                        Os ensaios ativos aparecerão aqui.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
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