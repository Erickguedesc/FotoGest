package com.fotolhar.dto;

import com.fotolhar.enums.StatusEnsaio;
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
public class HistoricoStatusEnsaioResponse {

    private UUID id;
    private UUID ensaioId;
    private StatusEnsaio status;
    private OffsetDateTime alteradoEm;
}