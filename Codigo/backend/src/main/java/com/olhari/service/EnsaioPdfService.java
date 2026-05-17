package com.olhari.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.olhari.model.Album;
import com.olhari.model.Ensaio;
import com.olhari.model.Foto;
import com.olhari.model.SelecaoFoto;
import com.olhari.repository.EnsaioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import com.olhari.model.ConfiguracaoEstudio;
import com.olhari.model.Fotografa;
import com.olhari.repository.ConfiguracaoEstudioRepository;
import com.olhari.repository.FotografaRepository;
import org.springframework.security.core.context.SecurityContextHolder;


@Service
public class EnsaioPdfService {

    private static final Color GOLD = new Color(212, 175, 55);
    private static final Color LIGHT_BORDER = new Color(230, 230, 230);
    private static final Color DARK_TEXT = new Color(40, 40, 40);
    private static final Color MUTED_TEXT = new Color(110, 110, 110);

   private final EnsaioRepository ensaioRepository;
private final FotografaRepository fotografaRepository;
private final ConfiguracaoEstudioRepository configuracaoEstudioRepository;

public EnsaioPdfService(
        EnsaioRepository ensaioRepository,
        FotografaRepository fotografaRepository,
        ConfiguracaoEstudioRepository configuracaoEstudioRepository
) {
    this.ensaioRepository = ensaioRepository;
    this.fotografaRepository = fotografaRepository;
    this.configuracaoEstudioRepository = configuracaoEstudioRepository;
}

    @Transactional
    public byte[] gerarPdf(UUID id) {
        Ensaio ensaio = ensaioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ensaio não encontrado"));

        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4, 42, 42, 38, 38);
            PdfWriter.getInstance(document, outputStream);

            document.open();

ConfiguracaoEstudio estudio = buscarEstudioLogado();

adicionarCabecalho(document, estudio);            adicionarCliente(document, ensaio);
            adicionarDadosEnsaio(document, ensaio);
            adicionarValores(document, ensaio);
            adicionarSelecaoCliente(document, ensaio);
            adicionarObservacoes(document, ensaio);
adicionarRodape(document, estudio);
            document.close();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF do ensaio", e);
        }
    }

private void adicionarCabecalho(Document document, ConfiguracaoEstudio estudio) throws Exception {
    String nomeEstudio = valorOuTraco(estudio != null ? estudio.getNomeEstudio() : "Olhari Fotografia");
    String email = estudio != null ? estudio.getEmail() : null;
    String telefone = estudio != null ? estudio.getTelefone() : null;
    String instagram = estudio != null ? estudio.getInstagram() : null;
    String logoUrl = estudio != null ? estudio.getLogoUrl() : null;

    Font logoFont = new Font(Font.HELVETICA, 24, Font.BOLD, GOLD);
    Font subFont = new Font(Font.HELVETICA, 9, Font.NORMAL, MUTED_TEXT);
    Font titleFont = new Font(Font.HELVETICA, 17, Font.BOLD, DARK_TEXT);

    adicionarLogoEstudio(document, logoUrl);

    Paragraph logo = new Paragraph(nomeEstudio.toUpperCase(), logoFont);
    logo.setAlignment(Element.ALIGN_CENTER);
    logo.setSpacingAfter(4);
    document.add(logo);

    StringBuilder contato = new StringBuilder();

    if (email != null && !email.isBlank()) contato.append(email);
    if (telefone != null && !telefone.isBlank()) contato.append(" • ").append(telefone);
    if (instagram != null && !instagram.isBlank()) contato.append(" • ").append(instagram);

    Paragraph subtitulo = new Paragraph(
            contato.isEmpty() ? "Resumo do ensaio fotográfico" : contato.toString(),
            subFont
    );
    subtitulo.setAlignment(Element.ALIGN_CENTER);
    subtitulo.setSpacingAfter(22);
    document.add(subtitulo);

    Paragraph titulo = new Paragraph("Relatório do Ensaio e Seleção da Cliente", titleFont);
    titulo.setSpacingAfter(14);
    document.add(titulo);
}
    private void adicionarCliente(Document document, Ensaio ensaio) throws Exception {
        adicionarTituloSecao(document, "Cliente");

        PdfPTable table = criarTabela();

        if (ensaio.getCliente() != null) {
            adicionarLinha(table, "Nome", valorOuTraco(ensaio.getCliente().getNome()));
            adicionarLinha(table, "E-mail", valorOuTraco(ensaio.getCliente().getEmail()));
            adicionarLinha(table, "Telefone", valorOuTraco(ensaio.getCliente().getTelefone()));
            adicionarLinha(table, "Cidade", valorOuTraco(ensaio.getCliente().getCidade()));
        } else {
            adicionarLinha(table, "Nome", "Cliente não informado");
        }

        document.add(table);
    }

    private void adicionarDadosEnsaio(Document document, Ensaio ensaio) throws Exception {
        adicionarTituloSecao(document, "Informações do ensaio");

        PdfPTable table = criarTabela();

        adicionarLinha(table, "Tipo", formatarTipo(ensaio.getTipo()));
        adicionarLinha(table, "Status", formatarStatus(ensaio.getStatus()));
        adicionarLinha(table, "Data do ensaio", formatarData(ensaio.getDataEnsaio()));
        adicionarLinha(table, "Local", valorOuTraco(ensaio.getLocal()));
        adicionarLinha(table, "Progresso", valorOuTraco(ensaio.getProgresso()) + "%");

        document.add(table);
    }

    private void adicionarValores(Document document, Ensaio ensaio) throws Exception {
        adicionarTituloSecao(document, "Valores contratados");

        PdfPTable table = criarTabela();

        adicionarLinha(table, "Valor do pacote", formatarMoeda(ensaio.getValorPacote()));
        adicionarLinha(table, "Fotos incluídas no pacote", valorOuTraco(ensaio.getQtdFotosPacote()));
        adicionarLinha(table, "Cobra foto extra?", Boolean.TRUE.equals(ensaio.getCobrarFotoExtra()) ? "Sim" : "Não");
        adicionarLinha(table, "Valor por foto extra", formatarMoeda(ensaio.getValorFotoExtra()));

        document.add(table);
    }

    private void adicionarSelecaoCliente(Document document, Ensaio ensaio) throws Exception {
        adicionarTituloSecao(document, "Seleção da cliente");

        List<SelecaoFoto> selecoes = buscarSelecoesDoEnsaio(ensaio);

        if (selecoes.isEmpty()) {
            adicionarAviso(document, "Seleção ainda não enviada pela cliente.");
            return;
        }

        int fotosIncluidas = ensaio.getQtdFotosPacote() == null ? 0 : ensaio.getQtdFotosPacote();
        int totalSelecionadas = selecoes.size();
        int fotosExcedentes = Math.max(0, totalSelecionadas - fotosIncluidas);

        BigDecimal valorExcedente = calcularValorExcedente(
                fotosExcedentes,
                ensaio.getValorFotoExtra(),
                ensaio.getCobrarFotoExtra()
        );

        PdfPTable resumo = criarTabela();

        adicionarLinha(resumo, "Status da seleção", "Seleção enviada");
        adicionarLinha(resumo, "Quantidade selecionada", String.valueOf(totalSelecionadas));
        adicionarLinha(resumo, "Fotos incluídas no pacote", String.valueOf(fotosIncluidas));
        adicionarLinha(resumo, "Fotos excedentes", String.valueOf(fotosExcedentes));
        adicionarLinha(resumo, "Total estimado de excedentes", formatarMoeda(valorExcedente));

        document.add(resumo);

        adicionarSubtitulo(document, "Fotos selecionadas");

PdfPTable fotosTable = new PdfPTable(4);
fotosTable.setWidthPercentage(100);
fotosTable.setSpacingAfter(12);

try {
    fotosTable.setWidths(new float[]{0.5f, 1.2f, 2.4f, 1.8f});
} catch (DocumentException ignored) {
}

adicionarCabecalhoTabela(fotosTable, "#");
adicionarCabecalhoTabela(fotosTable, "Foto");
adicionarCabecalhoTabela(fotosTable, "Nome da foto");
adicionarCabecalhoTabela(fotosTable, "Selecionada em");

for (int i = 0; i < selecoes.size(); i++) {
    SelecaoFoto selecao = selecoes.get(i);
    Foto foto = selecao.getFoto();

    adicionarCelulaTabela(fotosTable, String.valueOf(i + 1));
    adicionarCelulaImagem(fotosTable, foto);
    adicionarCelulaTabela(
            fotosTable,
            foto != null ? valorOuTraco(foto.getNomeOriginal()) : "Foto não encontrada"
    );
    adicionarCelulaTabela(fotosTable, formatarData(selecao.getSelecionadaEm()));
}

document.add(fotosTable);
    }

    private void adicionarObservacoes(Document document, Ensaio ensaio) throws Exception {
        adicionarTituloSecao(document, "Observações");

        Font font = new Font(Font.HELVETICA, 11, Font.NORMAL, DARK_TEXT);

        String texto = valorOuTraco(ensaio.getObservacoes());

        Paragraph observacoes = new Paragraph(texto, font);
        observacoes.setSpacingAfter(18);

        document.add(observacoes);
    }

private void adicionarRodape(Document document, ConfiguracaoEstudio estudio) throws Exception {
    Font font = new Font(Font.HELVETICA, 9, Font.NORMAL, MUTED_TEXT);

    String dataGeracao = OffsetDateTime.now()
            .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

    String nomeEstudio = estudio != null && estudio.getNomeEstudio() != null
            ? estudio.getNomeEstudio()
            : "Olhari Fotografia";

    String endereco = estudio != null ? estudio.getEndereco() : null;
    String cnpj = estudio != null ? estudio.getCnpj() : null;

    StringBuilder texto = new StringBuilder();
    texto.append("Documento gerado automaticamente pelo sistema Olhari em ")
            .append(dataGeracao)
            .append(".");

    if (endereco != null && !endereco.isBlank()) {
        texto.append("\n").append(endereco);
    }

    if (cnpj != null && !cnpj.isBlank()) {
        texto.append("\nCNPJ: ").append(cnpj);
    }

    texto.append("\n").append(nomeEstudio);

    Paragraph rodape = new Paragraph(texto.toString(), font);
    rodape.setSpacingBefore(28);
    rodape.setAlignment(Element.ALIGN_CENTER);

    document.add(rodape);
}



    private List<SelecaoFoto> buscarSelecoesDoEnsaio(Ensaio ensaio) {
        Album album = ensaio.getAlbum();

        if (album == null || album.getSelecoes() == null || album.getSelecoes().isEmpty()) {
            return List.of();
        }

        List<SelecaoFoto> selecoesFinalizadas = album.getSelecoes()
                .stream()
                .filter(selecao -> Boolean.TRUE.equals(selecao.getFinalizada()))
                .sorted(Comparator.comparing(
                        SelecaoFoto::getSelecionadaEm,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .toList();

        if (!selecoesFinalizadas.isEmpty()) {
            return selecoesFinalizadas;
        }

        return album.getSelecoes()
                .stream()
                .sorted(Comparator.comparing(
                        SelecaoFoto::getSelecionadaEm,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .toList();
    }

    private BigDecimal calcularValorExcedente(
            int fotosExcedentes,
            BigDecimal valorFotoExtra,
            Boolean cobrarFotoExtra
    ) {
        if (fotosExcedentes <= 0) {
            return BigDecimal.ZERO;
        }

        if (!Boolean.TRUE.equals(cobrarFotoExtra)) {
            return BigDecimal.ZERO;
        }

        if (valorFotoExtra == null) {
            return BigDecimal.ZERO;
        }

        return valorFotoExtra.multiply(BigDecimal.valueOf(fotosExcedentes));
    }

    private void adicionarTituloSecao(Document document, String titulo) throws Exception {
        Font font = new Font(Font.HELVETICA, 13, Font.BOLD, GOLD);

        Paragraph section = new Paragraph(titulo, font);
        section.setSpacingBefore(12);
        section.setSpacingAfter(8);

        document.add(section);
    }

    private void adicionarSubtitulo(Document document, String titulo) throws Exception {
        Font font = new Font(Font.HELVETICA, 11, Font.BOLD, DARK_TEXT);

        Paragraph section = new Paragraph(titulo, font);
        section.setSpacingBefore(8);
        section.setSpacingAfter(8);

        document.add(section);
    }

    private ConfiguracaoEstudio buscarEstudioLogado() {
    try {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Fotografa fotografa = fotografaRepository.findByEmail(email)
                .orElse(null);

        if (fotografa == null) {
            return null;
        }

        return configuracaoEstudioRepository.findByFotografaId(fotografa.getId())
                .orElse(null);
    } catch (Exception e) {
        return null;
    }
}

private void adicionarLogoEstudio(Document document, String logoUrl) {
    if (logoUrl == null || logoUrl.isBlank()) {
        return;
    }

    try {
        String urlLogo = prepararUrlImagemParaPdf(logoUrl);

        Image logo = Image.getInstance(URI.create(urlLogo).toURL());
        logo.scaleToFit(90, 60);
        logo.setAlignment(Element.ALIGN_CENTER);
        logo.setSpacingAfter(8);

        document.add(logo);
    } catch (Exception ignored) {
        // Se a logo estiver inválida ou indisponível, o PDF continua sendo gerado normalmente.
    }
}

private String prepararUrlImagemParaPdf(String url) {
    if (url == null || url.isBlank()) {
        return url;
    }

    if (!url.contains("/upload/")) {
        return url;
    }

    return url.replace(
            "/upload/",
            "/upload/c_fit,w_240,h_160,q_auto,f_jpg/"
    );
}
    private void adicionarAviso(Document document, String mensagem) throws Exception {
        Font font = new Font(Font.HELVETICA, 10, Font.NORMAL, MUTED_TEXT);

        Paragraph aviso = new Paragraph(mensagem, font);
        aviso.setSpacingAfter(12);

        document.add(aviso);
    }

    private PdfPTable criarTabela() {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(12);

        try {
            table.setWidths(new float[]{1.3f, 2.7f});
        } catch (DocumentException ignored) {
        }

        return table;
    }

    private void adicionarLinha(PdfPTable table, String label, String valor) {
        Font labelFont = new Font(Font.HELVETICA, 10, Font.BOLD, DARK_TEXT);
        Font valueFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);

        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setPadding(8);
        labelCell.setBorder(Rectangle.BOTTOM);
        labelCell.setBorderColor(LIGHT_BORDER);

        PdfPCell valueCell = new PdfPCell(new Phrase(valor, valueFont));
        valueCell.setPadding(8);
        valueCell.setBorder(Rectangle.BOTTOM);
        valueCell.setBorderColor(LIGHT_BORDER);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void adicionarCabecalhoTabela(PdfPTable table, String texto) {
        Font font = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);

        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setBackgroundColor(GOLD);
        cell.setPadding(8);
        cell.setBorder(Rectangle.NO_BORDER);

        table.addCell(cell);
    }

    private void adicionarCelulaTabela(PdfPTable table, String texto) {
        Font font = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.BLACK);

        PdfPCell cell = new PdfPCell(new Phrase(valorOuTraco(texto), font));
        cell.setPadding(8);
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(LIGHT_BORDER);

        table.addCell(cell);
    }

    private String formatarMoeda(BigDecimal valor) {
        if (valor == null) {
            return "—";
        }
return NumberFormat
        .getCurrencyInstance(Locale.forLanguageTag("pt-BR"))
        .format(valor);
    }

    private String formatarData(OffsetDateTime data) {
        if (data == null) {
            return "—";
        }

        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    private String formatarStatus(Object status) {
        if (status == null) {
            return "—";
        }

        return switch (status.toString()) {
            case "AGENDADO" -> "Agendado";
            case "REALIZADO" -> "Realizado";
            case "EM_SELECAO" -> "Em seleção";
            case "EM_EDICAO" -> "Em edição";
            case "FINALIZADO" -> "Entregue";
            case "CANCELADO" -> "Cancelado";
            default -> status.toString();
        };
    }

    private void adicionarCelulaImagem(PdfPTable table, Foto foto) {
    PdfPCell cell = new PdfPCell();
    cell.setPadding(6);
    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
    cell.setBorder(Rectangle.BOTTOM);
    cell.setBorderColor(LIGHT_BORDER);

    try {
        if (foto == null || foto.getUrlWatermark() == null || foto.getUrlWatermark().isBlank()) {
            cell.addElement(new Phrase("—", new Font(Font.HELVETICA, 9, Font.NORMAL, MUTED_TEXT)));
            table.addCell(cell);
            return;
        }

        String urlMiniatura = gerarUrlMiniaturaCloudinary(foto.getUrlWatermark());

Image imagem = Image.getInstance(URI.create(urlMiniatura).toURL());
        imagem.scaleToFit(55, 75);
        imagem.setAlignment(Element.ALIGN_CENTER);

        cell.addElement(imagem);
    } catch (Exception e) {
        cell.addElement(new Phrase("Imagem indisponível", new Font(Font.HELVETICA, 8, Font.NORMAL, MUTED_TEXT)));
    }

    table.addCell(cell);
}
private String gerarUrlMiniaturaCloudinary(String url) {
    if (url == null || url.isBlank()) {
        return url;
    }

    if (!url.contains("/upload/")) {
        return url;
    }

    return url.replace(
            "/upload/",
            "/upload/c_fill,w_180,h_240,q_auto,f_jpg/"
    );
}

    private String formatarTipo(Object tipo) {
        if (tipo == null) {
            return "—";
        }

        return switch (tipo.toString()) {
            case "NEWBORN" -> "Newborn";
            case "GESTANTE" -> "Gestante";
            case "FAMILIA" -> "Família";
            case "INFANTIL" -> "Infantil";
            case "FEMININO" -> "Feminino";
            case "CASAL" -> "Casal";
            case "BOOK" -> "Book";
            case "BATIZADO" -> "Batizado";
            case "EXTERNO" -> "Externo";
            case "FORMATURA" -> "Formatura";
            case "EVENTO" -> "Evento";
            case "DEBUTANTE" -> "Debutante";
            case "OUTRO" -> "Outro";
            default -> tipo.toString();
        };
    }

    private String valorOuTraco(Object valor) {
        if (valor == null) {
            return "—";
        }

        String texto = valor.toString();

        return texto.isBlank() ? "—" : texto;
    }
}