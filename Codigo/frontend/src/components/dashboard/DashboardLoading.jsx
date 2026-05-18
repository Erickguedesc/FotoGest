import Header from '../layout/Header'

export default function DashboardLoading() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#0A0A0A] px-4 pt-24 text-white md:px-8">
                <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                    <div className="h-16 w-72 rounded-2xl bg-white/10" />

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-40 rounded-3xl bg-white/10"
                            />
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-6">
                            <div className="h-96 rounded-3xl bg-white/10" />

                            <div className="h-72 rounded-3xl bg-white/10" />
                        </div>

                        <div className="space-y-6">
                            <div className="h-72 rounded-3xl bg-white/10" />

                            <div className="h-96 rounded-3xl bg-white/10" />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}