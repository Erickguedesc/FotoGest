package com.fotogest.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenciasUpdateRequest {
    private Integer qtdFotosPadrao;
    private BigDecimal valorFotoExtraPadrao;
    private Integer prazoExpiracaoAlbumDias;
    private String cidadePadrao;
    private String mensagemEnvioAlbum;
    private String mensagemSelecaoRecebida;
    private String capaAlbumPadraoUrl;

}