import AcessoAlbumError from "./AcessoAlbumError"

export default function AcessoAlbumForm({
  senha,
  setSenha,
  erro,
  loading,
  onSubmit,
}) {
  return (
    <>
      <label className="gate-label">
        Senha de acesso <span style={{ color: "var(--gold)" }}>*</span>
      </label>

      <input
        className={`gate-input ${erro ? "err" : ""}`}
        type="password"
        placeholder="Digite a senha de acesso."
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit()
        }}
      />

      <AcessoAlbumError mensagem={erro} />

      <div className="gate-hint">
Senha de acesso ao álbum.        <br />
        <b>Acesso por token — sem cadastro</b>
      </div>

      <button
        className={`gate-btn ${loading ? "loading" : ""}`}
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Verificando..." : "Acessar galeria"}
      </button>
    </>
  )
}