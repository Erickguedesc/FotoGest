import "../../../styles/album-access.css"

export default function AcessoAlbumLoading() {
  return (
    <div id="gateScreen">
      <div className="gate-card">
        <div className="gate-body">
          <div className="gate-title">Validando álbum...</div>
          <div className="gate-hint">
            Aguarde enquanto verificamos o link de acesso.
          </div>
        </div>
      </div>
    </div>
  )
}