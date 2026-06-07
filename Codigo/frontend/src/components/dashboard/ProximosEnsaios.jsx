import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
    ArrowRight,
    CalendarDays,
    Camera,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    Plus,
} from 'lucide-react'

import {
    formatarHora,
    formatarStatusEnsaio,
} from '../../utils/dashboardFormatters'

function getDate(value) {
    if (!value) return null

    const date = new Date(value)

    return Number.isNaN(date.getTime()) ? null : date
}

function capitalize(value = '') {
    return value.charAt(0).toUpperCase() + value.slice(1)
}

function getRelativeDay(value) {
    const date = getDate(value)
    if (!date) return 'Sem data'

    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffDays = Math.round((startOfDate - startOfToday) / 86400000)

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Amanha'
    if (diffDays > 1) return `Em ${diffDays} dias`

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
    })
}

function formatarDataCompleta(value) {
    const date = getDate(value)
    if (!date) return 'Data nao definida'

    return capitalize(date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    }))
}

export default function ProximosEnsaios({ ensaios }) {
    const [indexAtual, setIndexAtual] = useState(0)

    if (!ensaios?.length) {
        return (
            <section className="theme-card rounded-[18px] border p-4">
                <div className="theme-divider flex items-center gap-3 border-b pb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold)] text-[#1A1200] shadow-[0_12px_24px_rgba(183,131,58,0.18)]">
                        <Camera size={18} />
                    </span>

                    <h2 className="theme-muted whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Proximo ensaio
                    </h2>
                </div>

                <div className="mt-4 rounded-[16px] border border-[var(--border)] bg-[var(--card-hover)] px-4 py-8 text-center">
                    <div>
                        <h3 className="theme-title font-serif text-3xl font-light leading-tight">
                            Agenda livre
                        </h3>

                        <p className="theme-muted mx-auto mt-3 max-w-[260px] text-sm leading-6">
                            Os proximos ensaios aparecem aqui quando forem agendados.
                        </p>

                        <Link
                            to="/novo-ensaio"
                            className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-[#b7833a] px-5 py-3 text-sm font-semibold text-[#fff7e6] shadow-[0_12px_24px_rgba(183,131,58,0.16)] transition hover:bg-[#a87532]"
                        >
                            <Plus size={15} />
                            Novo ensaio
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    function proximo() {
        setIndexAtual((prev) =>
            prev === ensaios.length - 1 ? 0 : prev + 1
        )
    }

    function anterior() {
        setIndexAtual((prev) =>
            prev === 0 ? ensaios.length - 1 : prev - 1
        )
    }

    return (
        <section className="theme-card overflow-hidden rounded-[18px] border p-4">
            <div className="theme-divider mb-4 flex items-center justify-between gap-3 border-b pb-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold)] text-[#1A1200] shadow-[0_12px_24px_rgba(183,131,58,0.18)]">
                        <Camera size={18} />
                    </span>

                    <h2 className="theme-muted whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Proximo ensaio
                    </h2>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                    <span className="theme-muted min-w-10 text-center text-sm font-semibold">
                        {indexAtual + 1} de {ensaios.length}
                    </span>

                    <button
                        type="button"
                        onClick={anterior}
                        title="Ensaio anterior"
                        aria-label="Ensaio anterior"
                        className="theme-icon-button flex h-9 w-9 items-center justify-center rounded-full border transition"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    <button
                        type="button"
                        onClick={proximo}
                        title="Proximo ensaio"
                        aria-label="Proximo ensaio"
                        className="theme-icon-button flex h-9 w-9 items-center justify-center rounded-full border transition"
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300"
                    style={{
                        transform: `translateX(-${indexAtual * 100}%)`,
                    }}
                >
                    {ensaios.map((ensaio) => (
                        <div key={ensaio.id} className="min-w-full">
                            <EnsaioSlide ensaio={ensaio} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
                {ensaios.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setIndexAtual(index)}
                        aria-label={`Ver ensaio ${index + 1}`}
                        className={`h-2 rounded-full transition-all ${
                            index === indexAtual
                                ? 'w-9 bg-[var(--gold)]'
                                : 'w-2 bg-[var(--border)]'
                        }`}
                    />
                ))}
            </div>
        </section>
    )
}

function EnsaioSlide({ ensaio }) {
    const tipo = ensaio.tipoExibicao || ensaio.tipo || 'Nao informado'

    return (
        <article className="overflow-hidden rounded-[16px] border border-[var(--gold-border)] bg-[var(--gold-dim)] p-4">
            <div className="flex items-start justify-between gap-4">
                <span className="inline-flex max-w-[68%] items-center gap-2 truncate rounded-full border border-[var(--gold-border)] bg-[var(--card)] px-3 py-1.5 text-[11px] font-semibold uppercase text-[var(--gold)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
                    <span className="truncate">{formatarStatusEnsaio(ensaio.status)}</span>
                </span>

                <span className="theme-muted shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em]">
                    {getRelativeDay(ensaio.dataEnsaio)}
                </span>
            </div>

            <h3 className="theme-title mt-6 truncate font-serif text-3xl font-light leading-tight">
                {ensaio.clienteNome}
            </h3>

            <div className="mt-4 h-0.5 w-14 rounded-full bg-[var(--gold)]" />

            <div className="mt-5 rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-3">
                <InfoDateTime
                    date={formatarDataCompleta(ensaio.dataEnsaio)}
                    time={formatarHora(ensaio.dataEnsaio)}
                />

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <InfoBox
                        icon={Camera}
                        label="Tipo"
                        value={tipo}
                    />

                    <InfoBox
                        icon={MapPin}
                        label="Local"
                        value={ensaio.local || 'Nao informado'}
                    />
                </div>
            </div>

            <Link
                to={`/ensaios/${ensaio.id}`}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-[13px] border border-[var(--gold-border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[#1A1200]"
            >
                Abrir ensaio
                <ArrowRight size={18} className="ml-2" />
            </Link>
        </article>
    )
}

function InfoDateTime({ date, time }) {
    return (
        <div className="rounded-[13px] border border-[var(--border)] bg-[var(--card-hover)] px-4 py-3">
            <span className="theme-muted block text-[10px] font-semibold uppercase tracking-[0.18em]">
                Data e horario
            </span>

            <span className="theme-title mt-2 flex min-w-0 items-center gap-2 text-sm font-semibold">
                <CalendarDays size={16} className="shrink-0 text-[var(--gold)]" />
                <span className="truncate">{date}</span>
            </span>

            <span className="theme-muted mt-1.5 flex items-center gap-2 text-sm">
                <Clock3 size={15} className="shrink-0" />
                {time}
            </span>
        </div>
    )
}

function InfoBox({ icon: Icon, label, value }) {
    return (
        <div className="min-h-[78px] rounded-[13px] border border-[var(--border)] bg-[var(--card-hover)] px-3 py-3">
            <span className="theme-muted block text-[10px] font-semibold uppercase tracking-[0.18em]">
                {label}
            </span>

            <span className="mt-2 flex min-w-0 items-center gap-2">
                <Icon size={16} className="shrink-0 text-[var(--gold)]" strokeWidth={1.8} />

                <span className="theme-title block truncate text-sm font-medium">
                    {value}
                </span>
            </span>
        </div>
    )
}
