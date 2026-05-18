package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioDestaqueResponse {

    private String melhorPeriodo;
    private BigDecimal maiorReceita;
    private BigDecimal menorReceita;
}