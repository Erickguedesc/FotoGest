import BaseModal from './BaseModal'

export default function ConfirmDeleteModal({ ensaio, open, loading, onClose, onConfirm }) {
  return (
    <BaseModal
      open={open}
      title="Excluir ensaio"
      onClose={onClose}
      maxWidth="max-w-[440px]"
      footer={(
        <>
          <button type="button" onClick={onClose} disabled={loading} className="rounded-lg border border-white/[0.10] px-4 py-2.5 text-[12px] tracking-[0.08em] text-white/60 transition hover:text-white disabled:opacity-50">Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="rounded-lg bg-red-400/90 px-5 py-2.5 text-[12px] font-medium tracking-[0.1em] text-[#1A0505] transition hover:bg-red-300 disabled:opacity-60">
            {loading ? 'Excluindo...' : 'Excluir definitivamente'}
          </button>
        </>
      )}
    >
      <p className="text-[14px] leading-6 text-white/65">
        Tem certeza que deseja excluir permanentemente o ensaio de <strong className="text-white">{ensaio?.clienteNome}</strong>?
      </p>
      <p className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-[12px] leading-5 text-red-200/80">
        O backend só permite excluir ensaios com status Agendado ou Cancelado. Esta ação não poderá ser desfeita.
      </p>
    </BaseModal>
  )
}
