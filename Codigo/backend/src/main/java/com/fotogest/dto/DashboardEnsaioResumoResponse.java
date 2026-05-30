package com.fotogest.dto;

import com.fotogest.enums.StatusEnsaio;
import com.fotogest.enums.TipoEnsaio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardEnsaioResumoResponse {

    private UUID id;
    private String clienteNome;

    private TipoEnsaio tipo;
    private String tipoPersonalizado;
    private String tipoExibicao;
    private StatusEnsaio status;

    private OffsetDateTime dataEnsaio;
    private OffsetDateTime atualizadoEm;
    private String local;

    private Short progresso;
    private BigDecimal valorPacote;

    private Integer totalFotos;
    private String capaUrl;

    private Boolean albumPublicado;
    private Boolean selecaoEnviada;
}
