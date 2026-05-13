package com.olhari.dto;

import com.olhari.enums.StatusLead;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSolicitacaoResumoResponse {

    private UUID id;
    private String nomeCliente;
    private String whatsapp;
    private String tipoEnsaio;
    private LocalDate dataDesejada;
    private StatusLead statusLead;
    private OffsetDateTime recebidoEm;
    
}