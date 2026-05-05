import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
  validarAlbumPorToken,
  acessarAlbumComSenha,
} from "../services/albumAccessService"

import AcessoAlbumLayout from "../components/album/acessoAlbum/AcessoAlbumLayout"
import AcessoAlbumForm from "../components/album/acessoAlbum/AcessoAlbumForm"
import AcessoAlbumLoading from "../components/album/acessoAlbum/AcessoAlbumLoading"

//import "../styles/album-access.css"

export default function AlbumAccessPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [validandoToken, setValidandoToken] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function validarToken() {
      try {
        setErro("")
        await validarAlbumPorToken(token)
      } catch {
        setErro("Álbum não encontrado ou indisponível.")
      } finally {
        setValidandoToken(false)
      }
    }

    validarToken()
  }, [token])

  async function handleAcessar() {
    if (!senha.trim()) {
      setErro("Informe a senha de acesso.")
      return
    }

    try {
      setLoading(true)
      setErro("")

      await acessarAlbumComSenha(token, senha)

      navigate("/galeria")
    } catch {
      setErro("Senha incorreta. Verifique e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (validandoToken) {
    return <AcessoAlbumLoading />
  }

  return (
    <AcessoAlbumLayout token={token}>
      <AcessoAlbumForm
        senha={senha}
        setSenha={setSenha}
        erro={erro}
        loading={loading}
        onSubmit={handleAcessar}
      />
    </AcessoAlbumLayout>
  )
}