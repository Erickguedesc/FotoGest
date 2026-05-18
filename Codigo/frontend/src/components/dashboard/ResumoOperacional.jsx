export default function ResumoOperacional({
    dashboard,
}) {
    return (
        <section className="space-y-5">
            <div className="border-b border-white/10 pb-4">
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                    Resumo operacional
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-[#171717] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Finalizados
                    </p>

                    <h2 className="mt-3 font-serif text-5xl font-light text-white">
                        {dashboard?.ensaiosFinalizadosMes || 0}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#171717] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Solicitações
                    </p>

                    <h2 className="mt-3 font-serif text-5xl font-light text-white">
                        {dashboard?.solicitacoesRecebidasMes || 0}
                    </h2>
                </div>

                <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#171717] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Seleções enviadas
                    </p>

                    <h2 className="mt-3 font-serif text-5xl font-light text-[#D4AF37]">
                        {dashboard?.selecoesEnviadas || 0}
                    </h2>
                </div>
            </div>
        </section>
    )
}