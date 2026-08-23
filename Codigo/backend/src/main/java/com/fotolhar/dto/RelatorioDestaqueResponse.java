package com.fotolhar.dto;

import com.fotolhar.enums.TipoEnsaio;
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
    private TipoEnsaio tipoMaisRealizado;
    private String tipoMaisRealizadoExibicao;
    private Integer quantidadeTipoMaisRealizado;
}
