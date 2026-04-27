import { createBrowserRouter } from 'react-router-dom'
// Importa a função responsável por criar o sistema de rotas da aplicação

import HomePage from '../pages/HomePage'
// Importa a página inicial (HomePage), que será exibida na rota principal

const router = createBrowserRouter([
  {
    path: '/',
    // Define a rota principal do sistema
    // "/" representa a página inicial do site

    element: <HomePage />,
    // Quando o usuário acessar "/", será renderizada a HomePage
  },

  // Futuras rotas podem ser adicionadas aqui conforme o crescimento do projeto
  // Exemplo:
  // {
  //   path: '/login',
  //   element: <LoginPage />,
  // },

  // {
  //   path: '/dashboard',
  //   element: <DashboardPage />,
  // },
])

// Cria e organiza todas as rotas principais da aplicação

export default router
// Exporta o router para ser utilizado no main.jsx ou App.jsx