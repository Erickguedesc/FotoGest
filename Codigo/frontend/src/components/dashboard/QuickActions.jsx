import { Link } from 'react-router-dom'

import {
    Camera,
    FileBarChart2,
    Images,
    Users,
} from 'lucide-react'

const secondaryActionClass =
    'theme-card inline-flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm transition hover:border-[var(--gold-border)]'

export default function QuickActions() {
    return (
        <section className="space-y-5">
            <div className="theme-divider border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Ações rápidas
                </h2>
            </div>

            <div className="flex flex-wrap gap-4">
                <Link
                    to="/novo-ensaio"
                    className="inline-flex items-center gap-3 rounded-2xl bg-[var(--gold)] px-5 py-4 text-sm font-semibold text-[#1A1200] transition hover:bg-[var(--gold-light)]"
                >
                    <Camera size={18} />
                    Novo ensaio
                </Link>

                <Link to="/ensaios" className={secondaryActionClass}>
                    <Images size={18} />
                    Ver ensaios
                </Link>

                <Link to="/clientes" className={secondaryActionClass}>
                    <Users size={18} />
                    Clientes
                </Link>

                <Link to="/relatorios" className={secondaryActionClass}>
                    <FileBarChart2 size={18} />
                    Relatórios
                </Link>
            </div>
        </section>
    )
}
