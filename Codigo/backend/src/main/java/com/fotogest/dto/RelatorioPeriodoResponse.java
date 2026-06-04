package com.fotogest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioPeriodoResponse {

    private String label;

    private LocalDate inicio;
    private LocalDate fim;

    private BigDecimal faturamento;
    private BigDecimal excedentesCobrados;
    private BigDecimal ajustesManuais;
    private BigDecimal totalLiquido;
    private BigDecimal valorRecebido;
    private BigDecimal valorPendente;

    private Integer quantidadeEnsaios;
    private Integer clientesNovos;
    private Integer fotosExtrasVendidas;
}
