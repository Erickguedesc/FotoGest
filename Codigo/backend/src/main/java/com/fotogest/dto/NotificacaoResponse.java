package com.fotogest.dto;

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
public class NotificacaoResponse {

    private String chave;
    private String tipo;
    private String prioridade;
    private String titulo;
    private String descricao;
    private String actionUrl;
    private UUID ensaioId;
    private String clienteNome;
    private OffsetDateTime dataReferencia;
}
