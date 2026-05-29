import { Link } from 'react-router-dom'
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    Images,
    Upload,
} from 'lucide-react'

const CONFIG = {
    UPLOAD_PENDENTE: {
        icon: Upload,
        color: 'text-red-300',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20',
        badge: 'bg-red-400',
        action: 'Enviar fotos',
    },

    ENSAIO_ATRASADO: {
        icon: AlertTriangle,
        color: 'text-orange-300',
        bg: 'bg-orange-400/10',
        border: 'border-orange-400/20',
        badge: 'bg-orange-400',
        action: 'Atualizar status',
    },

    ALBUM_PENDENTE: {
        icon: Images,
        color: 'text-sky-300',
        bg: 'bg-sky-400/10',
        border: 'border-sky-400/20',
        badge: 'bg-sky-400',
        action: 'Publicar álbum',
    },

    SELECAO_ENVIADA: {
        icon: CheckCircle2,
        color: 'text-emerald-300',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20',
        badge: 'bg-emerald-400',
        action: 'Revisar seleção',
    },
}

export default function AtencaoNecessaria({ itens }) {
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

                    <h3 className="mt-4 text-sm font-medium text-white/85">
                        Nenhuma pendência encontrada
                    </h3>

                    <p className="mt-2 max-w-xs text-sm text-white/50">
                        Todos os ensaios estão em dia.
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

            <div className="relative">
                <div
                    className="theme-scrollbar space-y-4 overflow-y-auto pr-2"
                    style={{ maxHeight: '668px' }}
                >
                    {itens.map((item, index) => {
                        const config = CONFIG[item.tipo] || CONFIG.UPLOAD_PENDENTE
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
                                                <h3 className="text-sm font-medium text-[var(--text)]">
                                                    {item.titulo}
                                                </h3>

                                                <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                                                    {item.descricao}
                                                </p>
                                            </div>

                                            <span
                                                className={`mt-1 h-2.5 w-2.5 rounded-full ${config.badge}`}
                                            />
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                                            <span className="rounded-full border border-[var(--border)] bg-black/5 px-3 py-1">
                                                {item.clienteNome}
                                            </span>

                                            {item.dataReferencia && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock3 size={12} />

                                                    {new Date(item.dataReferencia).toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            to={item.ensaioId ? `/ensaios/${item.ensaioId}` : '/ensaios'}
                                            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-black/5 px-3 py-2 text-xs font-medium text-[var(--text)] transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
                                        >
                                            {config.action}
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>

                {itens.length > 4 && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-[#171717] to-transparent" />
                )}
            </div>
        </section>
    )
}
