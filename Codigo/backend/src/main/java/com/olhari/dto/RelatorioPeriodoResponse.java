package com.olhari.dto;

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
    private BigDecimal totalLiquido;

    private Integer quantidadeEnsaios;
}