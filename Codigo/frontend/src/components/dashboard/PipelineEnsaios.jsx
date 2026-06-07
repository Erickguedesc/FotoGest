import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    CalendarDays,
    Camera,
    Check,
    ChevronRight,
    Image as ImageIcon,
    List,
    PencilLine,
    Workflow,
    X,
} from 'lucide-react'

import { formatarStatusEnsaio } from '../../utils/dashboardFormatters'

const ORDER = [
    'AGENDADO',
    'REALIZADO',
    'EM_SELECAO',
    'EM_EDICAO',
    'FINALIZADO',
    'CANCELADO',
]

const STATUS_UI = {
    AGENDADO: {
        icon: CalendarDays,
        color: 'text-indigo-300',
        border: 'border-indigo-300/30',
        bg: 'bg-indigo-300/10',
        line: 'bg-indigo-300',
    },
    REALIZADO: {
        icon: Camera,
        color: 'text-lime-300',
        border: 'border-lime-300/30',
        bg: 'bg-lime-300/10',
        line: 'bg-lime-300',
    },
    EM_SELECAO: {
        icon: ImageIcon,
        color: 'text-amber-300',
        border: 'border-amber-300/35',
        bg: 'bg-amber-300/10',
        line: 'bg-amber-300',
    },
    EM_EDICAO: {
        icon: PencilLine,
        color: 'text-sky-300',
        border: 'border-sky-300/35',
        bg: 'bg-sky-300/10',
        line: 'bg-sky-300',
    },
    FINALIZADO: {
        icon: Check,
        color: 'text-emerald-300',
        border: 'border-emerald-300/35',
        bg: 'bg-emerald-300/10',
        line: 'bg-emerald-300',
    },
    CANCELADO: {
        icon: X,
        color: 'text-red-300',
        border: 'border-red-300/35',
        bg: 'bg-red-300/10',
        line: 'bg-red-300',
    },
}

export default function PipelineEnsaios({ pipeline }) {
    const [viewMode, setViewMode] = useState('flow')
    const entries = ORDER.map((status) => ({
        status,
        value: Number(pipeline?.[status] || 0),
        ...STATUS_UI[status],
    }))
    const total = entries.reduce((sum, entry) => sum + entry.value, 0)

    return (
        <section className="theme-card rounded-2xl border p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="theme-muted text-xs uppercase tracking-[0.22em]">
                    Pipeline dos ensaios
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        title="Ver fluxo"
                        aria-label="Ver pipeline em fluxo"
                        onClick={() => setViewMode('flow')}
                        className={`theme-icon-button flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            viewMode === 'flow' ? 'border-[var(--gold-border)] text-[var(--gold)]' : ''
                        }`}
                    >
                        <Workflow size={15} />
                    </button>

                    <button
                        type="button"
                        title="Ver lista"
                        aria-label="Ver pipeline em lista"
                        onClick={() => setViewMode('list')}
                        className={`theme-icon-button flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            viewMode === 'list' ? 'border-[var(--gold-border)] text-[var(--gold)]' : ''
                        }`}
                    >
                        <List size={15} />
                    </button>
                </div>
            </div>

            {viewMode === 'flow' ? (
                <div className="theme-scrollbar overflow-x-auto pb-1">
                    <div className="min-w-[760px]">
                        <div className="grid grid-cols-[1fr_18px_1fr_18px_1fr_18px_1fr_18px_1fr_18px_1fr] items-center gap-2">
                            {entries.map((entry, index) => (
                                <FlowStep key={entry.status} entry={entry} showArrow={index < entries.length - 1} />
                            ))}
                        </div>

                        <div className="mt-3 grid grid-cols-6 gap-0">
                            {entries.map((entry) => (
                                <div key={entry.status} className="relative h-3">
                                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-[var(--card-hover)]" />
                                    <div className={`absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 ${entry.line} ${entry.value > 0 ? 'opacity-80' : 'opacity-25'}`} />
                                    <span className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${entry.line} ring-2 ring-[var(--card)] ${entry.value > 0 ? 'opacity-100' : 'opacity-45'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <PipelineList entries={entries} total={total} />
            )}
        </section>
    )
}

function FlowStep({ entry, showArrow }) {
    const Icon = entry.icon
    const active = entry.value > 0

    return (
        <>
            <Link
                to={`/ensaios?status=${entry.status}`}
                className={`group flex min-h-[98px] flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition hover:-translate-y-0.5 hover:bg-[var(--card-hover)] ${
                    active ? `${entry.border} ${entry.bg}` : 'border-transparent'
                }`}
            >
                <span className={`flex h-11 w-11 items-center justify-center rounded-full border ${entry.border} ${entry.bg} ${entry.color}`}>
                    <Icon size={19} strokeWidth={1.8} />
                </span>

                <span className="theme-text mt-2 max-w-full truncate text-[11px] font-medium">
                    {formatarStatusEnsaio(entry.status)}
                </span>

                <span className={`mt-1 font-serif text-xl leading-none ${active ? entry.color : 'theme-title'}`}>
                    {entry.value}
                </span>
            </Link>

            {showArrow ? (
                <ChevronRight size={16} strokeWidth={1.8} className="theme-muted justify-self-center" />
            ) : null}
        </>
    )
}

function PipelineList({ entries, total }) {
    const maxValue = Math.max(...entries.map((entry) => entry.value), 1)

    return (
        <div className="space-y-2 py-1">
            <div className="space-y-1.5">
                {entries.map((entry) => {
                    const percent = total > 0 ? Math.max(0, Math.round((entry.value / maxValue) * 100)) : 0
                    const Icon = entry.icon
                    const active = entry.value > 0

                    return (
                        <Link
                            key={entry.status}
                            to={`/ensaios?status=${entry.status}`}
                            className="grid min-h-[43px] grid-cols-[142px_minmax(120px,1fr)_34px] items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[var(--card-hover)] max-sm:grid-cols-[128px_minmax(80px,1fr)_28px]"
                        >
                            <span className="theme-text inline-flex min-w-0 items-center gap-2 text-sm font-medium">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${entry.border} ${entry.bg} ${entry.color}`}>
                                    <Icon size={15} strokeWidth={1.9} />
                                </span>
                                <span className="truncate">{formatarStatusEnsaio(entry.status)}</span>
                            </span>

                            <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-muted)_16%,transparent)]">
                                <div
                                    className={`h-full rounded-full ${entry.line} transition-all ${active ? 'opacity-95' : 'opacity-0'}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            <span className={`text-right font-serif text-xl leading-none ${active ? entry.color : 'theme-muted'}`}>
                                {entry.value}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
