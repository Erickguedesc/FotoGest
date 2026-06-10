import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
  validarAlbumPorToken,
  acessarAlbumComSenha,
} from "../services/albumAccessService"

import AcessoAlbumLayout from "../components/album/acessoAlbum/AcessoAlbumLayout"
import AcessoAlbumForm from "../components/album/acessoAlbum/AcessoAlbumForm"
import AcessoAlbumLoading from "../components/album/acessoAlbum/AcessoAlbumLoading"

import "../styles/album-access.css"

const MSG_ALBUM_PAUSADO =
  "Álbum em atualização. Ajustes estão sendo feitos nesta galeria. Assim que a nova versão for publicada, você receberá uma nova senha de acesso."

export default function AlbumAccessPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [albumInfo, setAlbumInfo] = useState(null)
  const [validandoToken, setValidandoToken] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function validarToken() {
      try {
        setErro("")
        const dadosPublicos = await validarAlbumPorToken(token)
        setAlbumInfo(dadosPublicos)
      } catch (error) {
        const status = error?.response?.status

        if (status === 403) {
          setErro(MSG_ALBUM_PAUSADO)
        } else if (status === 404) {
          setErro("Álbum não encontrado. Confira se o link recebido está correto.")
        } else if (status === 410) {
          setErro("Este álbum expirou. Entre em contato com a fotógrafa para solicitar um novo acesso.")
        } else {
          setErro("Não foi possível carregar este álbum agora. Tente novamente em instantes.")
        }
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

    const fotos = await acessarAlbumComSenha(token, senha)
    const dadosPublicos = await validarAlbumPorToken(token)

   sessionStorage.setItem(
  `fotogest_album_${token}`,
  JSON.stringify({
    ...dadosPublicos,
    fotos,
    senhaAcessoTemporaria: senha,
    acessoValidadoEm: new Date().toISOString(),
  })
)

    navigate(`/galeria/${token}`)
  } catch (error) {
    const status = error?.response?.status

    console.error("Erro ao acessar álbum:", error)

    if (status === 401) {
      setErro("Senha incorreta. Confira a senha enviada pela fotógrafa e tente novamente.")
    } else if (status === 403) {
      setErro(MSG_ALBUM_PAUSADO)
    } else if (status === 404) {
      setErro("Álbum não encontrado. Confira se o link recebido está correto.")
    } else if (status === 410) {
      setErro("Este álbum expirou. Entre em contato com a fotógrafa para solicitar um novo acesso.")
    } else {
      setErro("Não foi possível acessar a galeria agora. Tente novamente em instantes.")
    }
  } finally {
    setLoading(false)
  }
}

  if (validandoToken) {
    return <AcessoAlbumLoading />
  }

  return (
    <AcessoAlbumLayout token={token} albumInfo={albumInfo}>
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
