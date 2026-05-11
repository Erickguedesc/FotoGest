package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumPublicoResponse {

    private String nomeCliente;
    private String tipoEnsaio;
    private Integer quantidadeFotos;

    private OffsetDateTime dataEnsaio;
    private String local;

    private Boolean cobrarFotoExtra;
    private BigDecimal valorFotoExtra;
}