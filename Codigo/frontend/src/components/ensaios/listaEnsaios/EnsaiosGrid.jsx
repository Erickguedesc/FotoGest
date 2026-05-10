import EnsaioCard from './EnsaioCard'

export default function EnsaiosGrid({ ensaios, onView, onEdit, onStatus, onDelete, onPreContrato }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {ensaios.map((ensaio) => (
        <EnsaioCard key={ensaio.id} ensaio={ensaio} onView={onView} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} onPreContrato={onPreContrato} />
      ))}
    </div>
  )
}
