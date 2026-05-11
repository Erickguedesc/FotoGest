import { createBrowserRouter, Navigate } from 'react-router-dom'

import PrivateRoute from '../components/layout/PrivateRoute'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NovoEnsaioPage from '../pages/NovoEnsaioPage'
import EnsaiosPage from '../pages/EnsaiosPage'
import AlbumAccessPage from "../pages/AlbumAccessPage"
import SolicitacoesPage from '../pages/SolicitacoesPage'
import PreContratoPage from '../pages/PreContratoPage'
import DetalhesEnsaio from '../pages/DetalhesEnsaio'

// Futuras páginas — descomente conforme forem criadas:
// import DashboardPage      from '../pages/DashboardPage'
//import DetalhesEnsaioPage from '../pages/DetalhesEnsaioPage'
// import RelatoriosPage     from '../pages/RelatoriosPage'
// import SolicitacoesPage   from '../pages/SolicitacoesPage'

const router = createBrowserRouter([

  // ── Rotas públicas ──────────────────────────────────────────────────────────
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
  path: "/album/:token",
  element: <AlbumAccessPage />,
  },


  // ── Rotas privadas (exigem login) ───────────────────────────────────────────
  {
    path: '/novo-ensaio',
    element: (
      <PrivateRoute>
        <NovoEnsaioPage />
      </PrivateRoute>
    ),
  },
{
  path: '/ensaios/:id',
  element: (
    <PrivateRoute>
      <DetalhesEnsaio />
    </PrivateRoute>
  ),
},
  {
    path: '/ensaios',
    element: (
      <PrivateRoute>
        <EnsaiosPage />
      </PrivateRoute>
    ),
  },



  {
    path: '/ensaios/:ensaioId/pre-contrato',
    element: (
      <PrivateRoute>
        <PreContratoPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/solicitacoes',
    element: (
      <PrivateRoute>
        <SolicitacoesPage />
      </PrivateRoute>
    ),
  },

  // Futuras rotas privadas:
  // {
  //   path: '/dashboard',
  //   element: <PrivateRoute><DashboardPage /></PrivateRoute>,
  // },
  // {
  //   path: '/ensaios/:id',
  //   element: <PrivateRoute><DetalhesEnsaioPage /></PrivateRoute>,
  // },
  // {
  //   path: '/relatorios',
  //   element: <PrivateRoute><RelatoriosPage /></PrivateRoute>,
  // },
  // {
  //   path: '/solicitacoes',
  //   element: <PrivateRoute><SolicitacoesPage /></PrivateRoute>,
  // },

  // ── Rota não encontrada ─────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router