import ConfirmActionModal from '../../ui/ConfirmActionModal'
import { formatMoney } from '../../../services/galeriaUtils'

export default function ConfirmSelectionModal({
  open,
  totalSelecionadas,
  limite,
  excedente,
  cobraFotoExtra,
  valorExcedente,
  enviando,
  onCancel,
  onConfirm,
}) {
  const valorAdicional =
    excedente > 0
      ? cobraFotoExtra
        ? formatMoney(valorExcedente)
        : 'A combinar'
      : formatMoney(0)

  return (
    <ConfirmActionModal
      open={open}
      type="warning"
      title="Deseja finalizar?"
      description="Após confirmar, sua seleção será enviada ao profissional e não poderá ser alterada."
      confirmText="Confirmar"
      cancelText="Cancelar"
      loadingText="Enviando..."
      loading={enviando}
      onClose={onCancel}
      onConfirm={onConfirm}
    >
      <div className="rounded-[12px] border border-[#EEEAE7] bg-[#FAF9F7] p-3">
        <div className="flex justify-between border-b border-[#E6E0DB] py-2 text-[13px] text-[#65605C]">
          <span>Fotos selecionadas</span>
          <strong className="font-semibold text-[#1F1F21]">{totalSelecionadas}</strong>
        </div>
        <div className="flex justify-between border-b border-[#E6E0DB] py-2 text-[13px] text-[#65605C]">
          <span>Incluídas no pacote</span>
          <strong className="font-semibold text-[#1F1F21]">{limite}</strong>
        </div>
        <div className="flex justify-between py-2 text-[13px] text-[#65605C]">
          <span>Valor adicional</span>
          <strong className={excedente > 0 ? 'font-semibold text-red-600' : 'font-semibold text-[#1F1F21]'}>
            {valorAdicional}
          </strong>
        </div>
      </div>
    </ConfirmActionModal>
  )
}
