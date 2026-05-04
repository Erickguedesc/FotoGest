export default function AcessoAlbumLayout({ token, children }) {
  return (
    <div id="gateScreen">
      <div className="gate-card">
        <div className="gate-top">
          <div className="gate-title">Acesso à galeria</div>
          <div className="gate-sub">
            Acesso protegido por senha exclusiva.
            <br />
            Sem necessidade de cadastro.
          </div>
        </div>

        <div className="gate-body">
          <label className="gate-label">Link do álbum</label>

          <div className="gate-url-row">
            <span className="gate-url-prefix">olhari.com/album/</span>
            <span className="gate-token-val">{token}</span>
          </div>

          {children}
        </div>

        <div className="gate-foot">
          Acesso seguro · sem necessidade de cadastro
        </div>
      </div>
    </div>
  )
}