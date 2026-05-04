/*
import { Navigate } from 'react-router-dom'

/**
 * PrivateRoute — protege rotas que exigem login.
 * Se não tiver token no localStorage, redireciona para /login.
 */
/*
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
*/

// TEMPORÁRIO: libera as rotas protegidas sem login,
// apenas para visualizar as páginas durante o desenvolvimento.
export default function PrivateRoute({ children }) {
  return children
}