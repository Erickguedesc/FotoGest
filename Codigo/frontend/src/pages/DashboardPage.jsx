import { useEffect, useState } from 'react'

import Header from '../components/layout/Header'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardStats from '../components/dashboard/DashboardStats'
import PipelineEnsaios from '../components/dashboard/PipelineEnsaios'
import EnsaiosEmAndamento from '../components/dashboard/EnsaiosEmAndamento'
import UltimasAtualizacoes from '../components/dashboard/UltimasAtualizacoes'
import ProximosEnsaios from '../components/dashboard/ProximosEnsaios'
import AtencaoNecessaria from '../components/dashboard/AtencaoNecessaria'
import ResumoOperacional from '../components/dashboard/ResumoOperacional'
import DashboardLoading from '../components/dashboard/DashboardLoading'
import DashboardError from '../components/dashboard/DashboardError'
import QuickActions from '../components/dashboard/QuickActions'
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState'

import { dashboardService } from '../services/dashboardService'

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')

    async function carregarDashboard() {
        try {
            setLoading(true)
            setErro('')

            const resultado = await dashboardService.buscarResumo()

            setDashboard(resultado?.data ?? resultado)
        } catch (error) {
            console.error(error)

            setErro('Não foi possível carregar a dashboard.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        carregarDashboard()
    }, [])

    if (loading) {
        return <DashboardLoading />
    }

    if (erro) {
        return <DashboardError mensagem={erro} />
    }

    const totalEnsaios = Number(dashboard?.totalEnsaios || 0)

    if (totalEnsaios === 0) {
        return <DashboardEmptyState />
    }

    return (
        <>
            <Header />

            <main className="theme-page min-h-screen px-4 pt-24 pb-8 md:px-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <DashboardHeader dashboard={dashboard} />

                    <DashboardStats dashboard={dashboard} />

                    <div className="grid gap-6 pt-3 xl:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="space-y-6">
                            <EnsaiosEmAndamento
                                ensaios={dashboard?.ensaiosEmAndamento || []}
                            />

                            <PipelineEnsaios pipeline={dashboard?.pipelineStatus || {}} />

                            <UltimasAtualizacoes
                                ensaios={dashboard?.ultimasAtualizacoes || []}
                            />
                        </div>

                        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
                            <ProximosEnsaios
                                ensaios={dashboard?.proximosEnsaios || []}
                            />

                            <AtencaoNecessaria
                                itens={dashboard?.atencaoNecessaria || []}
                            />

                            <ResumoOperacional dashboard={dashboard} />

                            <QuickActions />
                        </aside>
                    </div>
                </div>
            </main>
        </>
    )
}
