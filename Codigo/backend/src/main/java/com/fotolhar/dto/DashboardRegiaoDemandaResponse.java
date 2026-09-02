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
public class DashboardRegiaoDemandaResponse {

    private String regiao;
    private Integer quantidadeClientes;
    private BigDecimal percentual;
}
