import { CalendarDays, MessageCircle, } from 'lucide-react'

export default function SolicitacoesRecentes({
    solicitacoes,
}) {
    if (!solicitacoes?.length) {
        return (
            <section className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                    <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                        Solicitações recentes
                    </h2>
                </div>

                <div className="rounded-3xl border border-dashed border-white/10 py-12 text-center">
                    <h3 className="text-lg font-medium text-white">
                        Nenhuma solicitação recente
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                        Novas solicitações aparecerão aqui.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-5">
            <div className="border-b border-white/10 pb-4">
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                    Solicitações recentes
                </h2>
            </div>

            <div className="space-y-4">
                {solicitacoes.map((solicitacao) => (
                    <article
                        key={solicitacao.id}
                        className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#171717] p-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-medium text-white">
                                    {solicitacao.nomeCliente}
                                </h3>

                                <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs uppercase tracking-wide text-[#D4AF37]">
                                    {solicitacao.tipoEnsaio}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 text-sm text-white/55">
                                <div className="flex items-center gap-2">
                                    <MessageCircle size={15} />
                                    {solicitacao.whatsapp}
                                </div>

                                {solicitacao.dataDesejada && (
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={15} />

                                        {new Date(
                                            solicitacao.dataDesejada
                                        ).toLocaleDateString('pt-BR')}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 lg:items-end">
                            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-wide text-amber-300">
                                {solicitacao.statusLead}
                            </span>

                            {solicitacao.recebidoEm && (
                                <p className="text-xs text-white/40">
                                    Recebido em{' '}
                                    {new Date(
                                        solicitacao.recebidoEm
                                    ).toLocaleDateString('pt-BR')}
                                </p>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}