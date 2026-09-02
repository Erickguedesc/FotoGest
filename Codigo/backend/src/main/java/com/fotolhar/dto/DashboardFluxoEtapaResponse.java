package com.fotolhar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardFluxoEtapaResponse {

    private String chave;
    private String titulo;
    private BigDecimal mediaDias;
    private Integer quantidadeAmostras;
    private Boolean parcial;
}
