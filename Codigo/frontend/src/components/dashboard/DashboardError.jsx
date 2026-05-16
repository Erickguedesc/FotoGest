import Header from '../layout/Header'

export default function DashboardError({
    mensagem,
}) {
    return (
        <>
            <Header />

            <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 text-white">
                <div className="max-w-md rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
                    <h1 className="text-2xl font-semibold text-red-200">
                        Erro ao carregar dashboard
                    </h1>

                    <p className="mt-4 text-sm leading-relaxed text-red-100/70">
                        {mensagem}
                    </p>
                </div>
            </main>
        </>
    )
}