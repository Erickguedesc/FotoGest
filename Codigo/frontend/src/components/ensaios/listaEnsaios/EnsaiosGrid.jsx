import EnsaioCard from './EnsaioCard'

export default function EnsaiosGrid({ ensaios, onView, onEdit, onStatus, onDelete, onPreContrato }) {
  return (
    <div className="grid justify-start gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,286px),286px))]">
      {ensaios.map((ensaio) => (
        <EnsaioCard key={ensaio.id} ensaio={ensaio} onView={onView} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} onPreContrato={onPreContrato} />
      ))}
    </div>
  )
}
