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
            <section className="rounded-3xl border border-white/10 bg-[#171717] p-6">
                <div className="border-b border-white/10 pb-4">
                    <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                        Próximos ensaios
                    </h2>
                </div>

                <div className="flex min-h-[260px] items-center justify-center text-center">
                    <div>
                        <h3 className="text-lg font-medium text-white">
                            Nenhum ensaio agendado
                        </h3>

                        <p className="mt-2 text-sm text-white/50">
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
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#171717] p-6">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/60">
                    Próximos ensaios
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={anterior}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1D1D1D] text-white/60 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={proximo}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1D1D1D] text-white/60 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
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
                            <div className="rounded-2xl border border-white/10 bg-[#1D1D1D] p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs uppercase tracking-wide text-[#D4AF37]">
                                        {ensaio.status}
                                    </span>

                                    <span className="text-xs uppercase tracking-wide text-white/40">
                                        {ensaio.tipo}
                                    </span>
                                </div>

                                <h3 className="font-serif text-4xl font-light text-white">
                                    {ensaio.clienteNome}
                                </h3>

                                <div className="mt-6 space-y-3 text-sm text-white/60">
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
                            ? 'w-8 bg-[#D4AF37]'
                            : 'w-2 bg-white/20'
                            }`}
                    />
                ))}
            </div>
        </section>
    )
}