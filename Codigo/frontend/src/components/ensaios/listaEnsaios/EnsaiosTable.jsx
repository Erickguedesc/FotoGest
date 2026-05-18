import EnsaioTableRow from './EnsaioTableRow'
import Icon from './Icon'

const columns = [
  { key: 'clienteNome', label: 'Cliente', sortable: true, className: 'w-[220px]' },
  { key: 'tipo', label: 'Tipo', sortable: true, className: 'w-[100px]' },
  { key: 'dataEnsaio', label: 'Data', sortable: true, className: 'w-[110px]' },
  { key: 'local', label: 'Local', className: 'w-[140px]' },
  { key: 'status', label: 'Status', sortable: true, className: 'w-[135px]' },
  { key: 'progresso', label: 'Progresso', className: 'w-[130px]' },
  { key: 'valorPacote', label: 'Valor', sortable: true, className: 'w-[110px]' },
  { key: 'actions', label: '', className: 'w-[210px]' },
]

export default function EnsaiosTable({
  ensaios,
  sort,
  onSort,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#141414]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1155px] table-fixed border-collapse">
          <thead>
            <tr className="border-b border-white/[0.10]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-[10.5px] font-normal uppercase tracking-[0.14em] text-white/30 ${column.className || ''}`}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      className="inline-flex items-center gap-1 transition hover:text-white/65"
                    >
                      {column.label}

                      <span
                        className={
                          sort.key === column.key
                            ? 'text-[var(--gold)]'
                            : 'text-white/25'
                        }
                      >
                        <Icon name="sort" size={10} />
                      </span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ensaios.map((ensaio) => (
              <EnsaioTableRow
                key={ensaio.id}
                ensaio={ensaio}
                onView={onView}
                onEdit={onEdit}
                onStatus={onStatus}
                onDelete={onDelete}
                onPreContrato={onPreContrato}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}