export default function AcessoAlbumError({ mensagem }) {
  if (!mensagem) return null

  return (
    <div className="gate-error show">
      <span>{mensagem}</span>
    </div>
  )
}