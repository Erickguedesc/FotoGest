import { Camera, Heart, ShieldCheck } from 'lucide-react'

const accessHighlights = [
  {
    icon: Camera,
    title: 'Suas lembranças',
    text: 'Reviva cada momento com facilidade.',
  },
  {
    icon: Heart,
    title: 'Seleção de fotos',
    text: 'Marque suas favoritas e envie sua seleção com facilidade.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacidade garantida',
    text: 'Acesso seguro e exclusivo para você.',
  },
]

function getFirstName(name = '') {
  return name.trim().split(/\s+/)[0] || ''
}

export default function AcessoAlbumLayout({ token, albumInfo, children }) {
  const clienteNome = albumInfo?.nomeCliente || albumInfo?.clienteNome || ''
  const primeiroNome = getFirstName(clienteNome)

  return (
    <div className="album-access-page">
      <div className="gate-screen">
        <div className="gate-card">
          <div className="gate-top">
            <div className="gate-kicker">Galeria privada</div>
            <div className="gate-title">
              {primeiroNome ? `Bem-vindo(a), ${primeiroNome}!` : 'Bem-vindo(a)!'}
            </div>
            <div className="gate-sub">
              Sua galeria está pronta para ser vista.
              <br />
              Informe a senha recebida para acessar suas fotos.
            </div>
          </div>

          <div className="gate-body">
            <div className="gate-url-row">
              <span className="gate-url-prefix">Galeria</span>
              <span className="gate-token-val">{token}</span>
            </div>

            {children}
          </div>

          <div className="gate-foot">
            Acesso seguro · sem necessidade de cadastro
          </div>
        </div>

        <div className="gate-highlights" aria-label="Benefícios da galeria">
          {accessHighlights.map(({ icon: Icon, title, text }) => (
            <div className="gate-highlight" key={title}>
              <span className="gate-highlight-icon">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
