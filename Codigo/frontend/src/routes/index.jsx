import { createBrowserRouter, Navigate } from 'react-router-dom'

import PrivateRoute from '../components/layout/PrivateRoute'
import LoginPage from '../pages/LoginPage'
import NovoEnsaioPage from '../pages/NovoEnsaioPage'
import EnsaiosPage from '../pages/EnsaiosPage'
import ClientesPage from '../pages/ClientesPage'
import ClienteHistoricoPage from '../pages/ClienteHistoricoPage'
import AlbumAccessPage from "../pages/AlbumAccessPage"
import PreContratoPage from '../pages/PreContratoPage'
import DetalhesEnsaio from '../pages/DetalhesEnsaio'
import GaleriaPage from "../pages/GaleriaPage"
import RelatoriosPage from '../pages/RelatoriosPage'
import DashboardPage from '../pages/DashboardPage'
import ConfiguracoesPage from '../pages/ConfiguracoesPage'

// Futuras páginas — descomente conforme forem criadas:
// import DashboardPage      from '../pages/DashboardPage'
//import DetalhesEnsaioPage from '../pages/DetalhesEnsaioPage'
// import RelatoriosPage     from '../pages/RelatoriosPage'

const router = createBrowserRouter([

  // ── Rotas públicas ──────────────────────────────────────────────────────────
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: "/album/:token",
    element: <AlbumAccessPage />,
  },
  {
    path: "/galeria/:token",
    element: <GaleriaPage />,
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
    path: '/clientes',
    element: (
      <PrivateRoute>
        <ClientesPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/clientes/:id',
    element: (
      <PrivateRoute>
        <ClienteHistoricoPage />
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
    path: '/relatorios',
    element: (
      <PrivateRoute>
        <RelatoriosPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
  },

  {
  path: '/configuracoes',
  element: (
    <PrivateRoute>
      <ConfiguracoesPage />
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
  // ── Rota não encontrada ─────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
