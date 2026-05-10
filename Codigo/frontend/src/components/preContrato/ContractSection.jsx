export default function ContractSection({ title, subtitle, number, icon, children }) {
  return (
    <section className="precontrato-section">
      <div className="precontrato-section-header">
        <div className="precontrato-section-icon">{icon}</div>
        <span className="precontrato-section-title">{title}</span>
        <span className="precontrato-section-num">{subtitle || number}</span>
      </div>
      {children}
    </section>
  )
}
