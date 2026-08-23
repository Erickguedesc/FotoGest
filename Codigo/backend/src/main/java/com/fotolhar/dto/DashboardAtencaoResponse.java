package com.fotolhar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAtencaoResponse {

    private String tipo;
    private String titulo;
    private String descricao;

    private UUID ensaioId;

    private String clienteNome;
    private OffsetDateTime dataReferencia;
}
