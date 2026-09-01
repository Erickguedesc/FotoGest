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
    if (diffDays === 1) return 'Amanhã'
    if (diffDays > 1) return `Em ${diffDays} dias`

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
    })
}

function formatarDataCurta(value) {
    const date = getDate(value)
    if (!date) return '-- --- ----'

    const dia = date.toLocaleDateString('pt-BR', { day: '2-digit' })
    const mes = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
    const ano = date.toLocaleDateString('pt-BR', { year: 'numeric' })

    return `${dia} ${mes.toUpperCase()} ${ano}`
}

function formatarDiaSemana(value) {
    const date = getDate(value)
    if (!date) return 'Sem data'

    return capitalize(date.toLocaleDateString('pt-BR', {
        weekday: 'long',
    }))
}

export default function ProximosEnsaios({ ensaios }) {
    const [indexAtual, setIndexAtual] = useState(0)

    if (!ensaios?.length) {
        return (
            <section className="theme-card rounded-[18px] border p-4">
                <div className="theme-divider flex items-center gap-3 border-b pb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold)] text-white shadow-[0_12px_24px_rgba(200,79,50,0.18)]">
                        <Camera size={18} />
                    </span>

                    <h2 className="theme-muted whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Próximo ensaio
                    </h2>
                </div>

                <div className="mt-4 rounded-[16px] border border-[var(--border)] bg-[var(--card-hover)] px-4 py-8 text-center">
                    <div>
                        <h3 className="theme-title font-serif text-3xl font-light leading-tight">
                            Agenda livre
                        </h3>

                        <p className="theme-muted mx-auto mt-3 max-w-[260px] text-sm leading-6">
                            Os próximos ensaios aparecem aqui quando forem agendados.
                        </p>

                        <Link
                            to="/novo-ensaio"
                            className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-[#C84F32] px-5 py-3 text-sm font-semibold text-[#FFFFFF] shadow-[0_12px_24px_rgba(200,79,50,0.16)] transition hover:bg-[#AE3F28]"
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
        <section className="theme-card overflow-hidden rounded-[18px] border p-3 shadow-[0_18px_42px_rgba(0,0,0,0.10)]">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300"
                    style={{
                        transform: `translateX(-${indexAtual * 100}%)`,
                    }}
                >
                    {ensaios.map((ensaio) => (
                        <div key={ensaio.id} className="min-w-full">
                            <EnsaioSlide
                                ensaio={ensaio}
                                total={ensaios.length}
                                current={indexAtual + 1}
                                onPrevious={anterior}
                                onNext={proximo}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-3 flex justify-center gap-2">
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

function EnsaioSlide({ ensaio, total, current, onPrevious, onNext }) {
    const tipo = ensaio.tipoExibicao || ensaio.tipo || 'Não informado'

    return (
        <article className="relative overflow-hidden rounded-[16px] border border-[var(--gold-border)] bg-[var(--card)] px-4 pb-4 pt-3">
            <div className="pointer-events-none absolute inset-x-[-18%] top-4 h-24 rounded-[0_0_50%_50%] bg-[var(--card-hover)] opacity-70" />

            <div className="relative flex flex-col items-center text-center">
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-[5px] border-[var(--card)] bg-[var(--gold-dim)] text-[var(--gold)] shadow-[0_14px_28px_rgba(0,0,0,0.12)]">
                    <Camera size={21} strokeWidth={1.8} />
                </span>

                <p className="theme-muted mt-3 text-[10px] font-bold uppercase tracking-[0.22em]">
                    Próximo ensaio
                </p>

                <p className="theme-title mt-0.5 text-sm font-semibold">
                    {current} de {total}
                </p>

                <div className="mt-2 flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={onPrevious}
                        title="Ensaio anterior"
                        aria-label="Ensaio anterior"
                        className="theme-icon-button flex h-8 w-8 items-center justify-center rounded-full border transition"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    <button
                        type="button"
                        onClick={onNext}
                        title="Próximo ensaio"
                        aria-label="Próximo ensaio"
                        className="theme-icon-button flex h-8 w-8 items-center justify-center rounded-full border transition"
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>

            <div className="relative mt-4 flex items-center justify-between gap-3">
                <span className="inline-flex max-w-[58%] items-center gap-2 truncate rounded-full border border-[var(--gold-border)] bg-[var(--card)] px-3 py-1.5 text-[11px] font-semibold uppercase text-[var(--gold)]">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]" />
                    <span className="truncate">{formatarStatusEnsaio(ensaio.status)}</span>
                </span>

                <span className="theme-muted shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    {getRelativeDay(ensaio.dataEnsaio)}
                </span>
            </div>

            <h3 className="theme-title relative mt-3 truncate font-serif text-2xl font-light leading-tight">
                {ensaio.clienteNome}
            </h3>

            <div className="mt-2 h-0.5 w-12 rounded-full bg-[var(--gold)]" />

            <div className="mt-4 grid grid-cols-2 gap-2.5">
                <InfoBox
                    icon={CalendarDays}
                    label="Data"
                    value={formatarDataCurta(ensaio.dataEnsaio)}
                    meta={formatarDiaSemana(ensaio.dataEnsaio)}
                />

                <InfoBox
                    icon={Clock3}
                    label="Horário"
                    value={formatarHora(ensaio.dataEnsaio)}
                />

                <InfoBox
                    icon={Camera}
                    label="Tipo"
                    value={tipo}
                />

                <InfoBox
                    icon={MapPin}
                    label="Local"
                    value={ensaio.local || 'Não informado'}
                />
            </div>

            <Link
                to={`/ensaios/${ensaio.id}`}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-[13px] border border-[var(--gold-border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-white"
            >
                Abrir ensaio
                <ArrowRight size={18} className="ml-2" />
            </Link>
        </article>
    )
}

function InfoBox({ icon: Icon, label, value, meta }) {
    return (
        <div className="flex min-h-[66px] min-w-0 items-center gap-2.5 rounded-[13px] border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 shadow-[0_8px_18px_rgba(0,0,0,0.04)]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-[var(--gold)]">
                <Icon size={16} strokeWidth={1.8} />
            </span>

            <span className="min-w-0 flex-1 text-left">
                <span className="theme-title block truncate text-[12px] font-bold">
                    {value}
                </span>

                {meta ? (
                    <span className="theme-muted mt-0.5 block truncate text-[10px]">
                        {meta}
                    </span>
                ) : null}

                <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--gold)]">
                    {label}
                </span>
            </span>
        </div>
    )
}
