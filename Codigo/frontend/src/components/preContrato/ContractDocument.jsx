import ContractSection from './ContractSection'
import DataCell from './DataCell'
import EditableField from './EditableField'
import FotoGestIcon from './FotoGestIcon'
import { recalculateFinancialDraft } from './preContratoHelpers'

const UserIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const ImageIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const MoneyIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const FileIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const PenIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>

export default function ContractDocument({ draft, onChange }) {
  const set = (field) => (value) => onChange({ ...draft, [field]: value })
  const setFinancial = (field) => (value) => onChange(recalculateFinancialDraft({ ...draft, [field]: value }, field))

  return (
    <div className="precontrato-wrap" id="contractDoc">
      <div className="precontrato-contract-header">
        <div className="precontrato-brand">
          <div className="precontrato-logo-row">
            <FotoGestIcon />
            <span className="precontrato-logo-text">FOTOGEST</span>
          </div>
          <div className="precontrato-brand-sub">Fotografia Profissional</div>
          <div className="precontrato-brand-contact">
            <EditableField value={draft.fotografaNome} onChange={set('fotografaNome')} /><br />
            <span><EditableField value={draft.fotografaEmail} onChange={set('fotografaEmail')} /></span> · <span><EditableField value={draft.fotografaTelefone} onChange={set('fotografaTelefone')} /></span><br />
            <EditableField value={draft.fotografaCidade} onChange={set('fotografaCidade')} />
          </div>
        </div>

        <div className="precontrato-doc-info">
          <div className="precontrato-num-label">Número do documento</div>
          <div className="precontrato-num"><EditableField value={draft.numeroDocumento} onChange={set('numeroDocumento')} /></div>
          <div className="precontrato-date">Emitido em <EditableField value={draft.dataEmissao} onChange={set('dataEmissao')} /></div>
          <div className="precontrato-date small">Válido até <EditableField value={draft.validade} onChange={set('validade')} /></div>
          <div className="precontrato-status-badge">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="#C9A459"><circle cx="4" cy="4" r="4"/></svg>
            <EditableField value={draft.statusDocumento} onChange={set('statusDocumento')} />
          </div>
        </div>
      </div>

      <div className="precontrato-title-band">
        <div className="precontrato-title-main">Pré-Contrato de Serviços Fotográficos</div>
      </div>

      <div className="precontrato-body">
        <ContractSection title="1. Dados do Cliente" subtitle="Contratante" icon={<UserIcon />}>
          <div className="precontrato-data-grid three">
            <DataCell label="Nome completo" value={draft.clienteNome} onChange={set('clienteNome')} />
            <DataCell label="CPF" value={draft.clienteCpf} onChange={set('clienteCpf')} />
            <DataCell label="Telefone" value={draft.clienteTelefone} onChange={set('clienteTelefone')} />
            <DataCell label="E-mail" value={draft.clienteEmail} onChange={set('clienteEmail')} />
            <DataCell label="Cidade" value={draft.clienteCidade} onChange={set('clienteCidade')} />
            <DataCell label="Indicação" value={draft.clienteIndicacao} onChange={set('clienteIndicacao')} muted />
          </div>
        </ContractSection>

        <div className="precontrato-divider" />

        <ContractSection title="2. Dados do Ensaio" subtitle="Objeto do contrato" icon={<ImageIcon />}>
          <div className="precontrato-data-grid">
            <DataCell label="Tipo de ensaio" value={draft.tipoEnsaio} onChange={set('tipoEnsaio')} />
            <DataCell label="Data" value={draft.dataEnsaio} onChange={set('dataEnsaio')} />
            <DataCell label="Horário" value={draft.horario} onChange={set('horario')} />
            <DataCell label="Local" value={draft.local} onChange={set('local')} />
            <DataCell label="Observações" value={draft.observacoes} onChange={set('observacoes')} full muted multiline />
          </div>
        </ContractSection>

        <div className="precontrato-divider" />

        <ContractSection title="3. Pacote e Valores" subtitle="Condições financeiras" icon={<MoneyIcon />}>
          <table className="precontrato-valores-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Qtd.</th>
                <th>Valor unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><EditableField value={draft.descricaoPacote} onChange={set('descricaoPacote')} /></td>
                <td><EditableField value={draft.quantidadePacote} onChange={setFinancial('quantidadePacote')} /></td>
                <td><EditableField value={draft.valorPacote} onChange={setFinancial('valorPacote')} /></td>
                <td>{draft.subtotalPacote || '—'}</td>
              </tr>
              <tr>
                <td>Fotos editadas incluídas</td>
                <td><EditableField value={draft.qtdFotos} onChange={set('qtdFotos')} /></td>
                <td>—</td>
                <td>Incluído</td>
              </tr>
              <tr className="muted-row">
                <td>Foto extra (se exceder)</td>
                <td><EditableField value={draft.qtdFotosExtras} onChange={setFinancial('qtdFotosExtras')} placeholder="0" /></td>
                <td><EditableField value={draft.valorFotoExtra} onChange={setFinancial('valorFotoExtra')} /></td>
                <td>{draft.subtotalFotosExtras || 'A calcular'}</td>
              </tr>
              <tr className="muted-row">
                <td>Deslocamento</td>
                <td>—</td>
                <td>—</td>
                <td><EditableField value={draft.deslocamento} onChange={setFinancial('deslocamento')} /></td>
              </tr>
              <tr className="total-row">
                <td>Total do pacote</td>
                <td />
                <td />
                <td className="td-total">{draft.totalPacote || '—'}</td>
              </tr>
            </tbody>
          </table>

          <div className="precontrato-payment-grid precontrato-data-grid three">
            <DataCell label="Forma de pagamento" value={draft.formaPagamento} onChange={set('formaPagamento')} />
            <DataCell label="Sinal (na contratação)" value={draft.sinal} onChange={setFinancial('sinal')} gold />
            <DataCell label="Saldo (na entrega)" value={draft.saldo} onChange={() => {}} readOnly />
          </div>

          <div className="precontrato-note">
            <strong>Nota:</strong> O sistema não realiza cobranças online. Os pagamentos ocorrem fora da plataforma (PIX, WhatsApp, etc) diretamente entre Fotofrafa(o) e Cliente.
          </div>
        </ContractSection>

        <div className="precontrato-divider" />

        <ContractSection title="4. Cláusulas" subtitle="Termos e condições" icon={<FileIcon />}>
          <div className="precontrato-clausulas">
            <div><span>§1</span><p>O presente pré-contrato tem validade de <strong>15 dias</strong> a partir da data de emissão. Após este prazo, os valores estão sujeitos a revisão.</p></div>
            <div><span>§2</span><p>O agendamento é confirmado somente mediante o pagamento do <strong>sinal informado neste documento</strong>. A data e o horário ficam reservados exclusivamente após a confirmação.</p></div>
            <div><span>§3</span><p>Em caso de cancelamento pela contratante com menos de <strong>48 horas de antecedência</strong>, o sinal não será reembolsado. Reagendamentos serão aceitos com aviso prévio mínimo de 5 dias.</p></div>
            <div><span>§4</span><p>As fotos editadas serão entregues via galeria online exclusiva com link protegido por senha. O prazo de entrega é de até <strong>20 dias úteis</strong> após a realização do ensaio.</p></div>
            <div><span>§5</span><p>As imagens exibidas na galeria conterão <strong>marca d'água visível</strong>. As fotos editadas em alta resolução serão disponibilizadas após quitação integral do contrato.</p></div>
            <div><span>§6</span><p>A fotógrafa reserva o direito de uso das imagens produzidas em seu portfólio, salvo acordo diferente formalizado por escrito.</p></div>
            <div><span>§7</span><p>Caso o cliente selecione mais fotos do que o pacote inclui, será gerado um <strong>valor adicional por foto excedente</strong>, a ser quitado antes da entrega final.</p></div>
          </div>
        </ContractSection>

        <div className="precontrato-divider" />

        <ContractSection title="5. Assinatura" subtitle="Aceite e vigência" icon={<PenIcon />}>
          <div className="precontrato-accept">
            Ao assinar este documento, as partes declaram ter lido e compreendido todos os termos acima, concordando expressamente com as condições estabelecidas neste pré-contrato de prestação de serviços fotográficos.
          </div>
          <div className="precontrato-sign-row">
            <div className="precontrato-sign-box">
              <div className="precontrato-data-key">Contratada — Fotógrafa</div>
              <div className="precontrato-sign-line" />
              <div className="precontrato-sign-name"><EditableField value={draft.fotografaNome} onChange={set('fotografaNome')} /></div>
              <div className="precontrato-sign-role">FotoGest Fotografia · <EditableField value={draft.fotografaDocumento} onChange={set('fotografaDocumento')} /></div>
            </div>
            <div className="precontrato-sign-box">
              <div className="precontrato-data-key">Contratante — Cliente</div>
              <div className="precontrato-sign-line" />
              <div className="precontrato-sign-name"><EditableField value={draft.clienteNome} onChange={set('clienteNome')} /></div>
              <div className="precontrato-sign-role">CPF <EditableField value={draft.clienteCpf} onChange={set('clienteCpf')} /></div>
            </div>
          </div>
          <div className="precontrato-sign-date">
            <EditableField value={draft.cidadeAssinatura} onChange={set('cidadeAssinatura')} /> · <EditableField value={draft.dataEmissao} onChange={set('dataEmissao')} /> · Documento gerado automaticamente pelo sistema FotoGest (RF02)
          </div>
        </ContractSection>
      </div>

      <footer className="precontrato-footer">
        <div>
          FotoGest Fotografia Profissional · {draft.fotografaEmail}<br />
          {draft.fotografaCidade}, Brasil
        </div>
        <div>
          Documento {draft.numeroDocumento} · Gerado em {draft.dataEmissaoCurta}<br />
          <span>RF02 — Pré-contrato automático</span>
        </div>
      </footer>
    </div>
  )
}
