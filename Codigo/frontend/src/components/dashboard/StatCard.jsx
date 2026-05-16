export default function StatCard({
    titulo,
    valor,
    descricao,
    icon: Icon,
    destaque = false,
}) {
    return (
        <article className="rounded-3xl border border-white/10 bg-[#171717] p-6 shadow-2xl transition hover:border-[#D4AF37]/40">
            <div className="mb-5 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {titulo}
                </p>

                <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-2 text-[#D4AF37]">
                    <Icon size={18} />
                </div>
            </div>

            <h2
                className={`font-serif text-5xl font-light ${destaque ? 'text-[#D4AF37]' : 'text-white'
                    }`}
            >
                {valor}
            </h2>

            <p className="mt-2 text-sm text-white/50">
                {descricao}
            </p>
        </article>
    )
}