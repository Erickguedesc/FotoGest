import {
    AlertTriangle,
    CheckCircle2,
    Upload,
    Clock3,
} from 'lucide-react'

const CONFIG = {
    UPLOAD_PENDENTE: {
        icon: Upload,
        color: 'text-red-300',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20',
        badge: 'bg-red-400',
    },

    SELECAO_ENVIADA: {
        icon: CheckCircle2,
        color: 'text-emerald-300',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20',
        badge: 'bg-emerald-400',
    },

    SOLICITACAO_PENDENTE: {
        icon: AlertTriangle,
        color: 'text-amber-300',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        badge: 'bg-amber-400',
    },
}

export default function AtencaoNecessaria({
    itens,
}) {
    if (!itens?.length) {
        return (
            <section className="rounded-3xl border border-white/10 bg-[#171717] p-6">
                <div className="mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                        Atenção necessária
                    </h2>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-10 text-center">
                    <div className="rounded-full bg-emerald-400/10 p-3 text-emerald-300">
                        <CheckCircle2 size={22} />
                    </div>

                    <h3 className="mt-4 text-sm font-medium text-white">
                        Nenhuma pendência encontrada
                    </h3>

                    <p className="mt-2 max-w-xs text-sm text-white/50">
                        Todos os ensaios e solicitações estão em dia.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="rounded-3xl border border-white/10 bg-[#171717] p-6">
            <div className="mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                    Atenção necessária
                </h2>
            </div>

            <div className="space-y-4">
                {itens.map((item, index) => {
                    const config =
                        CONFIG[item.tipo] ||
                        CONFIG.SOLICITACAO_PENDENTE

                    const Icon = config.icon

                    return (
                        <article
                            key={`${item.tipo}-${index}`}
                            className={`rounded-2xl border ${config.border} ${config.bg} p-4`}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${config.bg} ${config.color}`}
                                >
                                    <Icon size={18} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                {item.titulo}
                                            </h3>

                                            <p className="mt-1 text-sm leading-relaxed text-white/55">
                                                {item.descricao}
                                            </p>
                                        </div>

                                        <span
                                            className={`mt-1 h-2.5 w-2.5 rounded-full ${config.badge}`}
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/45">
                                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                                            {item.clienteNome}
                                        </span>

                                        {item.dataReferencia && (
                                            <span className="inline-flex items-center gap-1">
                                                <Clock3 size={12} />

                                                {new Date(
                                                    item.dataReferencia
                                                ).toLocaleDateString('pt-BR')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}