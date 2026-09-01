import BaseModal from './BaseModal'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import { formatCurrency, formatDate, getTipoExibicao } from './ensaioHelpers'

function Detail({ label, value, highlight }) {
  return (
    <div>
      <div className="mb-1 text-[10.5px] uppercase tracking-[0.14em] text-white/30">{label}</div>
      <div className={`text-[14px] ${highlight ? 'text-[var(--gold)]' : 'text-white/80'}`}>{value || '—'}</div>
    </div>
  )
}

export default function EnsaioDetailsModal({ ensaio, open, onClose, onEdit }) {
  return (
    <BaseModal
      open={open}
      title={ensaio?.clienteNome || 'Ensaio'}
      onClose={onClose}
      footer={(
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/[0.10] px-4 py-2.5 text-[12px] tracking-[0.08em] text-white/60 transition hover:text-white">Fechar</button>
          <button type="button" onClick={() => onEdit(ensaio)} className="rounded-lg bg-[#C84F32] px-5 py-2.5 text-[12px] font-medium tracking-[0.1em] text-white transition hover:bg-[#AE3F28]">Editar informações</button>
        </>
      )}
    >
      {ensaio && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label="Tipo" value={getTipoExibicao(ensaio)} />
            <Detail label="Data" value={formatDate(ensaio.dataEnsaio)} />
            <Detail label="Local" value={ensaio.local} />
            <Detail label="Valor" value={formatCurrency(ensaio.valorPacote)} highlight />
            <Detail label="Fotos do pacote" value={ensaio.qtdFotosPacote} />
            <Detail label="Foto extra" value={ensaio.cobrarFotoExtra ? formatCurrency(ensaio.valorFotoExtra) : 'Não cobra'} />
          </div>

          <div>
            <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-white/30">Status</div>
            <StatusBadge status={ensaio.status} />
          </div>

          <div>
            <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-white/30">Progresso</div>
            <ProgressBar value={ensaio.progresso} />
          </div>

          {ensaio.observacoes && (
            <div>
              <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-white/30">Observações</div>
              <p className="text-[13px] leading-6 text-white/60">{ensaio.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  )
}
