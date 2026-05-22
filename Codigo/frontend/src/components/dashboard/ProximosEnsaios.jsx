import { useState } from 'react'

import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    MapPin,
} from 'lucide-react'

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
                        <h3 className="theme-title text-lg font-medium">
                            Nenhum ensaio agendado
                        </h3>

                        <p className="theme-muted mt-2 text-sm">
                            Os próximos ensaios aparecerão aqui.
                        </p>
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
            <div className="theme-divider mb-6 flex items-center justify-between border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Próximos ensaios
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={anterior}
                        className="theme-icon-button flex h-9 w-9 items-center justify-center rounded-full border transition"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={proximo}
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
                        <div
                            key={ensaio.id}
                            className="min-w-full"
                        >
                            <div className="theme-panel rounded-2xl border p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs uppercase tracking-wide text-[#D4AF37]">
                                        {ensaio.status}
                                    </span>

                                    <span className="theme-muted text-xs uppercase tracking-wide">
                                        {ensaio.tipo}
                                    </span>
                                </div>

                                <h3 className="theme-title font-serif text-4xl font-light">
                                    {ensaio.clienteNome}
                                </h3>

                                <div className="theme-text mt-6 space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={16} />

                                        {new Date(
                                            ensaio.dataEnsaio
                                        ).toLocaleDateString('pt-BR')}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {ensaio.local}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-5 flex justify-center gap-2">
                {ensaios.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setIndexAtual(index)}
                        className={`h-2 rounded-full transition-all ${index === indexAtual
                            ? 'w-8 bg-[var(--gold)]'
                            : 'w-2 bg-[var(--border)]'
                            }`}
                    />
                ))}
            </div>
        </section>
    )
}
