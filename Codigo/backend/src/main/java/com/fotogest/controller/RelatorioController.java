package com.fotogest.controller;

import com.fotogest.dto.RelatorioFaturamentoResponse;
import com.fotogest.enums.TipoPeriodoRelatorio;
import com.fotogest.service.RelatorioPdfService;
import com.fotogest.service.RelatorioService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class RelatorioController {

    private final RelatorioService relatorioService;
    private final RelatorioPdfService relatorioPdfService;

    @GetMapping("/faturamento")
    public RelatorioFaturamentoResponse buscarFaturamento(
            @RequestParam(required = false, defaultValue = "MENSAL") TipoPeriodoRelatorio tipo,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        Integer anoFinal = ano == null ? LocalDate.now().getYear() : ano;

        return relatorioService.buscarFaturamento(tipo, anoFinal, dataInicio, dataFim);
    }

    @GetMapping("/faturamento/pdf")
    public ResponseEntity<byte[]> exportarFaturamentoPdf(
            @RequestParam(required = false, defaultValue = "MENSAL") TipoPeriodoRelatorio tipo,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        Integer anoFinal = ano == null ? LocalDate.now().getYear() : ano;
        byte[] pdf = relatorioPdfService.gerarPdf(tipo, anoFinal, dataInicio, dataFim);
        String filename = "relatorio-fotogest-" + tipo.name().toLowerCase() + "-" + anoFinal + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\""
                )
                .body(pdf);
    }
}
