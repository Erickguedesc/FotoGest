package com.olhari.dto;

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
public class DashboardResumoResponse {

    private Integer ensaiosEsteMes;
    private Integer selecoesEnviadas;
    private Integer ensaiosSemFotosEnviadas;
    private BigDecimal receitaEstimada;

    private Integer ensaiosFinalizadosMes;
    private Integer solicitacoesRecebidasMes;

    private List<DashboardEnsaioResumoResponse> proximosEnsaios;
    private List<DashboardEnsaioResumoResponse> ensaiosEmAndamento;
    private List<DashboardAtencaoResponse> atencaoNecessaria;
    private List<DashboardSolicitacaoResumoResponse> solicitacoesRecentes;
}