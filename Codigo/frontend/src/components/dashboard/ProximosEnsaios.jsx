import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
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

function getRelativeDay(value) {
    const date = getDate(value)
    if (!date) return 'Sem data'

    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffDays = Math.round((startOfDate - startOfToday) / 86400000)

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Amanhã'
    if (diffDays > 1) return `Em ${diffDays} dias`

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
    })
}

function formatarDataCompleta(value) {
    const date = getDate(value)
    if (!date) return 'Data não definida'

    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    })
}

export default function ProximosEnsaios({ ensaios }) {
    const [indexAtual, setIndexAtual] = useState(0)

    if (!ensaios?.length) {
        return (
            <section className="theme-card rounded-3xl border p-6">
                <div className="theme-divider border-b pb-4">
                    <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                        Próximos ensaios
                    </h2>
                </div>

                <div className="flex min-h-[260px] items-center justify-center text-center">
                    <div>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]">
                            <CalendarDays size={20} />
                        </div>

                        <h3 className="theme-title mt-4 text-lg font-medium">
                            Nenhum ensaio agendado
                        </h3>

                        <p className="theme-muted mt-2 text-sm">
                            Os próximos ensaios aparecem aqui.
                        </p>

                        <Link
                            to="/novo-ensaio"
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b7833a] px-4 py-2 text-sm font-medium text-[#fff7e6] shadow-[0_12px_24px_rgba(183,131,58,0.16)] transition hover:bg-[#a87532]"
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
        <section className="theme-card overflow-hidden rounded-3xl border p-6">
            <div className="theme-divider mb-6 flex items-center justify-between gap-4 border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Próximos ensaios
                </h2>

                <div className="flex items-center gap-2">
                    <span className="theme-muted min-w-10 text-center text-xs font-medium">
                        {indexAtual + 1} de {ensaios.length}
                    </span>

                    <button
                        type="button"
                        onClick={anterior}
                        title="Ensaio anterior"
                        aria-label="Ensaio anterior"
                        className="theme-icon-button flex h-9 w-9 items-center justify-center rounded-full border transition"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={proximo}
                        title="Próximo ensaio"
                        aria-label="Próximo ensaio"
                        className="theme-icon-button flex h-9 w-9 items-center justify-center rounded-full border transition"
                    >
                        <ChevronRight size={18} />
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
                            <div className="theme-panel rounded-2xl border p-5">
                                <div className="mb-5 flex items-start justify-between gap-3">
                                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#D4AF37]">
                                        {formatarStatusEnsaio(ensaio.status)}
                                    </span>

                                    <span className="theme-muted text-right text-xs uppercase tracking-wide">
                                        {getRelativeDay(ensaio.dataEnsaio)}
                                    </span>
                                </div>

                                <h3 className="theme-title truncate font-serif text-4xl font-light">
                                    {ensaio.clienteNome}
                                </h3>

                                <div className="mt-6 grid gap-3 text-sm">
                                    <div className="theme-soft rounded-2xl border p-4">
                                        <p className="theme-muted text-xs uppercase tracking-[0.18em]">
                                            Data e horário
                                        </p>

                                        <div className="theme-title mt-2 flex items-center gap-2 text-base font-medium capitalize">
                                            <CalendarDays size={16} />
                                            {formatarDataCompleta(ensaio.dataEnsaio)}
                                        </div>

                                        <div className="theme-muted mt-2 flex items-center gap-2 text-sm font-normal">
                                            <Clock3 size={14} />
                                            {formatarHora(ensaio.dataEnsaio)}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                        <div className="theme-soft rounded-2xl border p-4">
                                            <p className="theme-muted text-xs uppercase tracking-[0.18em]">
                                                Tipo
                                            </p>

                                            <div className="theme-text mt-2 flex items-center gap-2 text-sm font-normal">
                                                <Camera size={15} />
                                                <span className="truncate">
                                                    {ensaio.tipo || 'Não informado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="theme-soft rounded-2xl border p-4">
                                            <p className="theme-muted text-xs uppercase tracking-[0.18em]">
                                                Local
                                            </p>

                                            <div className="theme-text mt-2 flex items-start gap-2 text-sm font-normal">
                                                <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">
                                                    {ensaio.local || 'Não informado'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/ensaios/${ensaio.id}`}
                                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-[var(--gold-border)] bg-[var(--gold-dim)] px-4 py-3 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold-dim)]/80"
                                >
                                    Abrir ensaio
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-5 flex justify-center gap-2">
                {ensaios.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setIndexAtual(index)}
                        aria-label={`Ver ensaio ${index + 1}`}
                        className={`h-2 rounded-full transition-all ${
                            index === indexAtual
                                ? 'w-8 bg-[var(--gold)]'
                                : 'w-2 bg-[var(--border)]'
                        }`}
                    />
                ))}
            </div>
        </section>
    )
}
