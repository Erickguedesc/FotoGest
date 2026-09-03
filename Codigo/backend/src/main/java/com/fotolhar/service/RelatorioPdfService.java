package com.fotolhar.service;

import com.fotolhar.dto.RelatorioFaturamentoResponse;
import com.fotolhar.dto.RelatorioPeriodoResponse;
import com.fotolhar.dto.RelatorioTipoEnsaioResponse;
import com.fotolhar.enums.TipoPeriodoRelatorio;
import com.fotolhar.model.Usuario;
import com.fotolhar.repository.UsuarioRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class RelatorioPdfService {

    private static final Color GOLD = new Color(201, 164, 89);
    private static final Color LIGHT_BORDER = new Color(224, 224, 224);
    private static final Color DARK_TEXT = new Color(38, 38, 38);
    private static final Color MUTED_TEXT = new Color(100, 100, 100);

    private final RelatorioService relatorioService;
    private final UsuarioRepository usuarioRepository;

    public byte[] gerarPdf(TipoPeriodoRelatorio tipo, Integer ano) {
        return gerarPdf(tipo, ano, null, null);
    }

    public byte[] gerarPdf(TipoPeriodoRelatorio tipo, Integer ano, LocalDate dataInicio, LocalDate dataFim) {
        TipoPeriodoRelatorio tipoFinal = tipo == null ? TipoPeriodoRelatorio.MENSAL : tipo;
        int anoFinal = ano == null ? LocalDate.now().getYear() : ano;
        RelatorioFaturamentoResponse relatorio = relatorioService.buscarFaturamento(
                tipoFinal,
                anoFinal,
                dataInicio,
                dataFim);
        String nomeUsuario = buscarNomeUsuarioLogado();

        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 36, 36, 32, 32);

            PdfWriter.getInstance(document, outputStream);
            document.open();

            adicionarCabecalho(document, relatorio, nomeUsuario);
            adicionarResumo(document, relatorio);
            adicionarPeriodos(document, relatorio);
            adicionarTipos(document, relatorio);
            adicionarRodape(document);

            document.close();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF do relatorio", e);
        }
    }

    private void adicionarCabecalho(Document document, RelatorioFaturamentoResponse relatorio, String nomeUsuario) throws Exception {
        Font marcaFont = new Font(Font.HELVETICA, 18, Font.BOLD, GOLD);
        Font tituloFont = new Font(Font.HELVETICA, 20, Font.BOLD, DARK_TEXT);
        Font textoFont = new Font(Font.HELVETICA, 10, Font.NORMAL, MUTED_TEXT);

        Paragraph marca = new Paragraph(valorOuTraco(nomeUsuario).toUpperCase(), marcaFont);
        marca.setAlignment(Element.ALIGN_CENTER);
        marca.setSpacingAfter(6);
        document.add(marca);

        Paragraph titulo = new Paragraph("Relatorio financeiro", tituloFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        titulo.setSpacingAfter(4);
        document.add(titulo);

        Paragraph subtitulo = new Paragraph(valorOuTraco(relatorio.getPeriodoDescricao()), textoFont);
        subtitulo.setAlignment(Element.ALIGN_CENTER);
        subtitulo.setSpacingAfter(18);
        document.add(subtitulo);
    }

    private void adicionarResumo(Document document, RelatorioFaturamentoResponse relatorio) throws Exception {
        adicionarTituloSecao(document, "Resumo");

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingAfter(16);
        table.setWidths(new float[]{1.2f, 1.2f, 1.2f, 1.2f});

        adicionarMetrica(table, "Valor previsto", formatarMoeda(relatorio.getFaturamentoTotal()));
        adicionarMetrica(table, "Valor recebido", formatarMoeda(relatorio.getValorRecebido()));
        adicionarMetrica(table, "Ticket medio", formatarMoeda(relatorio.getTicketMedioEnsaio()));
        adicionarMetrica(table, "Ensaios", valorOuZero(relatorio.getEnsaiosRealizados()));
        adicionarMetrica(table, "Clientes novos", valorOuZero(relatorio.getClientesNovos()));
        adicionarMetrica(table, "Pacotes", formatarMoeda(relatorio.getFaturamentoBruto()));
        adicionarMetrica(table, "Fotos extras", formatarMoeda(relatorio.getExcedentesCobrados()));
        adicionarMetrica(table, "Extras vendidas", valorOuZero(relatorio.getFotosExtrasVendidas()));
        adicionarMetrica(table, "Ajustes manuais", formatarMoeda(relatorio.getAjustesManuais()));
        table.completeRow();

        document.add(table);
    }

    private void adicionarPeriodos(Document document, RelatorioFaturamentoResponse relatorio) throws Exception {
        adicionarTituloSecao(document, "Detalhamento por periodo");

        PdfPTable table = new PdfPTable(9);
        table.setWidthPercentage(100);
        table.setSpacingAfter(16);
        table.setWidths(new float[]{0.8f, 1.1f, 1f, 1.1f, 0.9f, 1f, 1f, 0.7f, 0.8f});

        adicionarCabecalhoTabela(table, "Periodo");
        adicionarCabecalhoTabela(table, "Intervalo");
        adicionarCabecalhoTabela(table, "Pacotes");
        adicionarCabecalhoTabela(table, "Extras");
        adicionarCabecalhoTabela(table, "Ajustes");
        adicionarCabecalhoTabela(table, "Previsto");
        adicionarCabecalhoTabela(table, "Recebido");
        adicionarCabecalhoTabela(table, "Ensaios");
        adicionarCabecalhoTabela(table, "Clientes");

        if (relatorio.getPeriodos() == null || relatorio.getPeriodos().isEmpty()) {
            adicionarLinhaVazia(table, 9, "Nenhum periodo encontrado.");
        } else {
            for (RelatorioPeriodoResponse periodo : relatorio.getPeriodos()) {
                adicionarCelula(table, periodo.getLabel());
                adicionarCelula(table, formatarData(periodo.getInicio()) + "\n" + formatarData(periodo.getFim()));
                adicionarCelula(table, formatarMoeda(periodo.getFaturamento()));
                adicionarCelula(
                        table,
                        formatarMoeda(periodo.getExcedentesCobrados())
                                + "\n"
                                + valorOuZero(periodo.getFotosExtrasVendidas())
                                + " foto(s)");
                adicionarCelula(table, formatarMoeda(periodo.getAjustesManuais()));
                adicionarCelula(table, formatarMoeda(periodo.getTotalLiquido()));
                adicionarCelula(table, formatarMoeda(periodo.getValorRecebido()));
                adicionarCelula(table, valorOuZero(periodo.getQuantidadeEnsaios()));
                adicionarCelula(table, valorOuZero(periodo.getClientesNovos()));
            }
        }

        document.add(table);
    }

    private void adicionarTipos(Document document, RelatorioFaturamentoResponse relatorio) throws Exception {
        adicionarTituloSecao(document, "Ranking por tipo de ensaio");

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.7f, 1.2f, 1f, 1.2f, 0.8f, 0.9f});

        adicionarCabecalhoTabela(table, "Tipo");
        adicionarCabecalhoTabela(table, "Faturamento");
        adicionarCabecalhoTabela(table, "Participacao");
        adicionarCabecalhoTabela(table, "Ticket medio");
        adicionarCabecalhoTabela(table, "Ensaios");
        adicionarCabecalhoTabela(table, "Fotos extras");

        if (relatorio.getTiposEnsaio() == null || relatorio.getTiposEnsaio().isEmpty()) {
            adicionarLinhaVazia(table, 6, "Nenhum tipo de ensaio com receita no periodo.");
        } else {
            for (RelatorioTipoEnsaioResponse tipo : relatorio.getTiposEnsaio()) {
                adicionarCelula(table, tipo.getTipoExibicao() != null ? tipo.getTipoExibicao() : valorOuTraco(tipo.getTipo()));
                adicionarCelula(table, formatarMoeda(tipo.getFaturamento()));
                adicionarCelula(table, formatarPercentual(tipo.getPercentualReceita()));
                adicionarCelula(table, formatarMoeda(tipo.getTicketMedio()));
                adicionarCelula(table, valorOuZero(tipo.getQuantidadeEnsaios()));
                adicionarCelula(table, valorOuZero(tipo.getFotosExtrasVendidas()));
            }
        }

        document.add(table);
    }

    private void adicionarRodape(Document document) throws Exception {
        Font font = new Font(Font.HELVETICA, 8, Font.NORMAL, MUTED_TEXT);
        String dataGeracao = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        Paragraph rodape = new Paragraph("Documento gerado automaticamente pelo Fotolhar em " + dataGeracao + ".", font);

        rodape.setAlignment(Element.ALIGN_CENTER);
        rodape.setSpacingBefore(18);
        document.add(rodape);
    }

    private String buscarNomeUsuarioLogado() {
        try {
            String email = SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getName();

            return usuarioRepository.findByEmail(email)
                    .map(Usuario::getNome)
                    .filter(nome -> !nome.isBlank())
                    .orElse("Fotolhar");
        } catch (Exception e) {
            return "Fotolhar";
        }
    }

    private void adicionarTituloSecao(Document document, String titulo) throws Exception {
        Font font = new Font(Font.HELVETICA, 12, Font.BOLD, GOLD);
        Paragraph paragraph = new Paragraph(titulo, font);

        paragraph.setSpacingBefore(8);
        paragraph.setSpacingAfter(8);
        document.add(paragraph);
    }

    private void adicionarMetrica(PdfPTable table, String label, String value) {
        Font labelFont = new Font(Font.HELVETICA, 8, Font.NORMAL, MUTED_TEXT);
        Font valueFont = new Font(Font.HELVETICA, 13, Font.BOLD, DARK_TEXT);

        PdfPCell cell = new PdfPCell();
        cell.setPadding(9);
        cell.setBorder(Rectangle.BOX);
        cell.setBorderColor(LIGHT_BORDER);
        cell.addElement(new Paragraph(label, labelFont));
        cell.addElement(new Paragraph(value, valueFont));

        table.addCell(cell);
    }

    private void adicionarCabecalhoTabela(PdfPTable table, String texto) {
        Font font = new Font(Font.HELVETICA, 8, Font.BOLD, Color.WHITE);
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));

        cell.setBackgroundColor(GOLD);
        cell.setPadding(6);
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }

    private void adicionarCelula(PdfPTable table, Object valor) {
        Font font = new Font(Font.HELVETICA, 8, Font.NORMAL, DARK_TEXT);
        PdfPCell cell = new PdfPCell(new Phrase(valorOuTraco(valor), font));

        cell.setPadding(6);
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(LIGHT_BORDER);
        table.addCell(cell);
    }

    private void adicionarLinhaVazia(PdfPTable table, int colSpan, String texto) {
        Font font = new Font(Font.HELVETICA, 9, Font.NORMAL, MUTED_TEXT);
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));

        cell.setColspan(colSpan);
        cell.setPadding(10);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(LIGHT_BORDER);
        table.addCell(cell);
    }

    private String formatarMoeda(BigDecimal valor) {
        return NumberFormat
                .getCurrencyInstance(Locale.forLanguageTag("pt-BR"))
                .format(valor == null ? BigDecimal.ZERO : valor);
    }

    private String formatarPercentual(BigDecimal valor) {
        if (valor == null) {
            return "0%";
        }

        return valor.stripTrailingZeros().toPlainString().replace(".", ",") + "%";
    }

    private String formatarData(LocalDate data) {
        if (data == null) {
            return "-";
        }

        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private String valorOuZero(Integer valor) {
        return String.valueOf(valor == null ? 0 : valor);
    }

    private String valorOuTraco(Object valor) {
        if (valor == null) {
            return "-";
        }

        String texto = valor.toString();

        return texto.isBlank() ? "-" : texto;
    }
}
