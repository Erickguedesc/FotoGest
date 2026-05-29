import { Link } from 'react-router-dom'

import { formatarStatusEnsaio } from '../../utils/dashboardFormatters'

const ORDER = [
    'AGENDADO',
    'REALIZADO',
    'EM_SELECAO',
    'EM_EDICAO',
    'FINALIZADO',
    'CANCELADO',
]

const COLORS = {
    AGENDADO: 'bg-indigo-300',
    REALIZADO: 'bg-lime-300',
    EM_SELECAO: 'bg-orange-300',
    EM_EDICAO: 'bg-cyan-300',
    FINALIZADO: 'bg-[var(--gold)]',
    CANCELADO: 'bg-red-300',
}

export default function PipelineEnsaios({ pipeline }) {
    const entries = ORDER.map((status) => [
        status,
        Number(pipeline?.[status] || 0),
    ])

    const total = entries.reduce((sum, [, value]) => sum + value, 0)

    return (
        <section className="space-y-5">
            <div className="theme-divider border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Pipeline dos ensaios
                </h2>
            </div>

            <div className="theme-card rounded-3xl border p-6">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                            Etapas do trabalho
                        </p>

                        <h3 className="theme-title mt-2 font-serif text-4xl font-light">
                            {total}
                        </h3>

                        <p className="theme-muted mt-2 text-sm">
                            distribuição por status dos ensaios
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {entries.map(([status, value]) => {
                        const percent = total > 0 ? Math.round((value / total) * 100) : 0

                        return (
                            <Link
                                key={status}
                                to={`/ensaios?status=${status}`}
                                className="block rounded-xl p-1 transition hover:bg-[var(--card-hover)]"
                            >
                                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                    <span className="theme-text">
                                        {formatarStatusEnsaio(status)}
                                    </span>

                                    <span className="theme-muted">
                                        {value}
                                    </span>
                                </div>

                                <div className="theme-soft h-2 overflow-hidden rounded-full">
                                    <div
                                        className={`h-full rounded-full ${COLORS[status]}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
