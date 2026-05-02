import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import NovoEnsaioPage from '../pages/NovoEnsaioPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/ensaios',
    element: <NovoEnsaioPage />,
  },

  // Futuras rotas:
  // { path: '/login',         element: <LoginPage /> },
  // { path: '/dashboard',     element: <DashboardPage /> },
  // { path: '/ensaios',       element: <EnsaiosPage /> },
  // { path: '/ensaios/:id',   element: <DetalhesEnsaioPage /> },
  // { path: '/relatorios',    element: <RelatoriosPage /> },
  // { path: '/solicitacoes',  element: <SolicitacoesPage /> },
])

export default router