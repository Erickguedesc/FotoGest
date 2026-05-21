import { Link } from 'react-router-dom'

import {
    Camera,
    ClipboardList,
    FileBarChart2,
    Images,
    Users,
} from 'lucide-react'

export default function QuickActions() {
    return (
        <section className="space-y-5">
            <div className="border-b border-white/10 pb-4">
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                    Ações rápidas
                </h2>
            </div>

            <div className="flex flex-wrap gap-4">
                <Link
                    to="/novo-ensaio"
                    className="inline-flex items-center gap-3 rounded-2xl bg-[#D4AF37] px-5 py-4 text-sm font-semibold text-black transition hover:opacity-90"
                >
                    <Camera size={18} />
                    Novo ensaio
                </Link>

                <Link
                    to="/ensaios"
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-[#171717] px-5 py-4 text-sm text-white transition hover:border-[#D4AF37]/40"
                >
                    <Images size={18} />
                    Ver ensaios
                </Link>

                <Link
                    to="/clientes"
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-[#171717] px-5 py-4 text-sm text-white transition hover:border-[#D4AF37]/40"
                >
                    <Users size={18} />
                    Clientes
                </Link>

                <Link
                    to="/solicitacoes"
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-[#171717] px-5 py-4 text-sm text-white transition hover:border-[#D4AF37]/40"
                >
                    <ClipboardList size={18} />
                    Solicitações
                </Link>

                <Link
                    to="/relatorios"
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-[#171717] px-5 py-4 text-sm text-white transition hover:border-[#D4AF37]/40"
                >
                    <FileBarChart2 size={18} />
                    Relatórios
                </Link>
            </div>
        </section>
    )
}
