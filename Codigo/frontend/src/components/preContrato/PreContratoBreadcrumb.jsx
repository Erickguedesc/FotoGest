import { Link } from 'react-router-dom'

export default function PreContratoBreadcrumb({ clienteNome }) {
  return (
    <div className="precontrato-bc">
      <Link to="/ensaios">Ensaios</Link><span>›</span>
      <span className="precontrato-bc-muted">{clienteNome || 'Cliente'}</span><span>›</span>
      <strong>Pré-contrato</strong>
    </div>
  )
}
