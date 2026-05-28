package com.fotogest.dto;

import com.fotogest.enums.StatusLead;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoResponse {

    private UUID id;
    private String nomeCliente;
    private String whatsapp;
    private String tipoEnsaio;
    private LocalDate dataDesejada;
    private StatusLead statusLead;
    private OffsetDateTime recebidoEm;
}