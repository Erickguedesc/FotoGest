package com.fotogest.dto;

import com.fotogest.enums.TipoEnsaio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioTipoEnsaioResponse {

    private TipoEnsaio tipo;
    private String tipoExibicao;
    private BigDecimal faturamento;
    private BigDecimal percentualReceita;
    private BigDecimal ticketMedio;
    private Integer quantidadeEnsaios;
}
