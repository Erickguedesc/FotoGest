import ConfirmActionModal from '../../ui/ConfirmActionModal'

export default function SelectionSuccessModal({ open, onClose }) {
  return (
    <ConfirmActionModal
      open={open}
      type="success"
      title="Seleção confirmada!"
      description="Suas fotos favoritas foram enviadas para o profissional. A seleção não poderá mais ser alterada por aqui."
      confirmText="Entendi"
      showCancel={false}
      onClose={onClose}
      onConfirm={onClose}
    />
  )
}
