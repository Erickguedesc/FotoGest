package com.fotogest.dto;

import com.fotogest.enums.TipoPeriodoRelatorio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioFaturamentoResponse {

    private TipoPeriodoRelatorio tipo;
    private Integer ano;
    private String periodoDescricao;
    private String unidadePeriodo;

    private BigDecimal faturamentoTotal;
    private BigDecimal mediaPorPeriodo;
    private Integer ensaiosRealizados;

    private BigDecimal faturamentoBruto;
    private BigDecimal excedentesCobrados;
    private BigDecimal ajustesManuais;
    private BigDecimal totalLiquido;

    private RelatorioDestaqueResponse destaques;
    private RelatorioComparativoResponse comparativo;

    private List<RelatorioPeriodoResponse> periodos;
    private List<RelatorioTipoEnsaioResponse> tiposEnsaio;
}
