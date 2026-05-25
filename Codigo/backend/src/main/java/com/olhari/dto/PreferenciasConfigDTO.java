package com.olhari.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenciasConfigDTO {
    private UUID id;
    private Integer qtdFotosPadrao;
    private BigDecimal valorFotoExtraPadrao;
    private Integer prazoExpiracaoAlbumDias;
    private String cidadePadrao;
    private String mensagemEnvioAlbum;
    private String mensagemSelecaoRecebida;
    private String capaAlbumPadraoUrl;
    private String capaAlbumPadraoPublicId;

}