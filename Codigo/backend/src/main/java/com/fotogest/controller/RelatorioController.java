package com.fotogest.controller;

import com.fotogest.dto.RelatorioFaturamentoResponse;
import com.fotogest.enums.TipoPeriodoRelatorio;
import com.fotogest.service.RelatorioService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/faturamento")
    public RelatorioFaturamentoResponse buscarFaturamento(
            @RequestParam(required = false, defaultValue = "MENSAL") TipoPeriodoRelatorio tipo,
            @RequestParam(required = false) Integer ano
    ) {
        Integer anoFinal = ano == null ? LocalDate.now().getYear() : ano;

        return relatorioService.buscarFaturamento(tipo, anoFinal);
    }
}