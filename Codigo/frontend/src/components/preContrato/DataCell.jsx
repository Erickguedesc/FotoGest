import EditableField from './EditableField'

export default function DataCell({ label, value, onChange, full = false, muted = false, gold = false, multiline = false, readOnly = false }) {
  return (
    <div className={`precontrato-data-cell ${full ? 'full' : ''}`}>
      <div className="precontrato-data-key">{label}</div>
      <div className={`precontrato-data-val ${muted ? 'muted' : ''} ${gold ? 'gold' : ''}`}>
        <EditableField value={value} onChange={onChange} multiline={multiline} readOnly={readOnly} />
      </div>
    </div>
  )
}
