package com.olhari.dto;

import com.olhari.enums.StatusEnsaio;
import com.olhari.enums.TipoEnsaio;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
public class EnsaioResponse {

    private UUID id;
    private UUID clienteId;
    private String clienteNome;
    private TipoEnsaio tipo;
    private StatusEnsaio status;
    private OffsetDateTime dataEnsaio;
    private String local;
    private Integer qtdFotosPacote;
    private BigDecimal valorPacote;
    private BigDecimal valorFotoExtra;
    private Boolean cobrarFotoExtra;
    private String observacoes;
    private Short progresso;
    private OffsetDateTime criadoEm;
    private OffsetDateTime atualizadoEm;
}