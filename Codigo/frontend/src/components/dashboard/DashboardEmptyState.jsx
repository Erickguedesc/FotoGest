import Header from '../layout/Header'

export default function DashboardEmptyState() {
    return (
        <>
            <Header />

            <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 text-white">
                <div className="max-w-md rounded-3xl border border-white/10 bg-[#171717] p-10 text-center">
                    <h1 className="font-serif text-5xl font-light text-white">
                        Dashboard vazia
                    </h1>

                    <p className="mt-5 text-sm leading-relaxed text-white/55">
                        Ainda não existem ensaios, solicitações ou
                        movimentações suficientes para gerar indicadores.
                    </p>
                </div>
            </main>
        </>
    )
}