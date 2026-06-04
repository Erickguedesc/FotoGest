package com.fotogest.dto;

import com.fotogest.enums.StatusEnsaio;
import com.fotogest.enums.TipoEnsaio;
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
    private String clienteTelefone;
    private String clienteEmail;
    private String clienteCpf;
    private String clienteCidade;
    private String clienteIndicacao;

    private TipoEnsaio tipo;
    private String tipoPersonalizado;
    private String tipoExibicao;
    private StatusEnsaio status;

    private OffsetDateTime dataEnsaio;
    private String local;

    private Integer qtdFotosPacote;
    private BigDecimal valorPacote;
    private BigDecimal valorFotoExtra;
    private Boolean cobrarFotoExtra;

    private BigDecimal valorFinalEnsaio;
    private String statusValores;
    private String observacaoValores;

    private String observacoes;
    private String notasInternas;
    private Short progresso;
    private Integer totalFotos;
    private String capaUrl;

    private OffsetDateTime criadoEm;
    private OffsetDateTime atualizadoEm;
}
