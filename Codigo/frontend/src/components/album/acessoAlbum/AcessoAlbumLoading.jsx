import "../../../styles/album-access.css"

export default function AcessoAlbumLoading() {
  return (
    <div className="album-access-page">
      <div className="gate-screen">
        <div className="gate-card">
          <div className="gate-top">
            <div className="gate-kicker">Galeria privada</div>
            <div className="gate-title">Validando álbum...</div>
            <div className="gate-sub">
              Aguarde enquanto verificamos o link de acesso.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
