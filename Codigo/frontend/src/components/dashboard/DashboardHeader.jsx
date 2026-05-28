import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function DashboardHeader() {
    const hoje = new Date()

    const dataFormatada = hoje.toLocaleDateString(
        'pt-BR',
        {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }
    )

    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/40">
                    {dataFormatada}
                </p>

                <h1 className="font-serif text-5xl font-light tracking-wide text-white">
                    Dashboard{' '}
                    <span className="text-[#D4AF37]">
                        FotoGest
                    </span>
                </h1>
            </div>

            <Link
                to="/novo-ensaio"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold tracking-wide text-black transition hover:opacity-90"
            >
                <Plus size={18} />
                Novo ensaio
            </Link>
        </div>
    )
}