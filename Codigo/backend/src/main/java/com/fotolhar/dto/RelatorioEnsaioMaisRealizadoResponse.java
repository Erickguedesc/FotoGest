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
public class RelatorioEnsaioMaisRealizadoResponse {

    private TipoEnsaio tipo;
    private String tipoExibicao;
    private Integer quantidadeEnsaios;
    private BigDecimal percentual;
}
