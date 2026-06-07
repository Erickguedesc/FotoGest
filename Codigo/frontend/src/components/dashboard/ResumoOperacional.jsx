import { CalendarDays, CheckCircle2, ImageOff, TimerReset } from 'lucide-react'

export default function ResumoOperacional({ dashboard }) {
    const metrics = [
        {
            label: 'Hoje',
            value: dashboard?.ensaiosHoje || 0,
            icon: CalendarDays,
            color: 'text-sky-400',
        },
        {
            label: 'Próximos 7 dias',
            value: dashboard?.ensaiosProximosSeteDias || 0,
            icon: TimerReset,
            color: 'text-amber-400',
        },
        {
            label: 'Sem fotos enviadas',
            value: dashboard?.ensaiosSemFotosEnviadas || 0,
            icon: ImageOff,
            color: 'text-emerald-400',
        },
        {
            label: 'Finalizados no mês',
            value: dashboard?.ensaiosFinalizadosMes || 0,
            icon: CheckCircle2,
            color: 'text-emerald-400',
        },
    ]

    return (
        <section className="theme-card rounded-2xl border p-4">
            <h2 className="theme-muted mb-2 text-xs uppercase tracking-[0.22em]">
                Resumo de ensaios
            </h2>

            <div className="divide-y divide-[var(--border)]">
                {metrics.map((metric) => (
                    <Metric key={metric.label} {...metric} />
                ))}
            </div>
        </section>
    )
}

function Metric({ label, value, icon: Icon, color }) {
    return (
        <div className="grid min-h-11 grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-3 py-2.5">
            <Icon size={16} strokeWidth={1.8} className={`shrink-0 ${color}`} />

            <span className="theme-text truncate text-[13px]">
                {label}
            </span>

            <span className="theme-title font-serif text-2xl font-light leading-none">
                {value}
            </span>
        </div>
    )
}
