package com.fotolhar.dto;

import com.fotolhar.enums.StatusEnsaio;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
public class EnsaioConflitoAgendaResponse {
    private Boolean conflito;
    private UUID ensaioId;
    private UUID clienteId;
    private String clienteNome;
    private OffsetDateTime dataEnsaio;
    private String local;
    private StatusEnsaio status;
}
