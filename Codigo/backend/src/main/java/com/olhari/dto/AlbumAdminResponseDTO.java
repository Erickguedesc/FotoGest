package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumAdminResponseDTO {

    private UUID id;
    private UUID ensaioId;
    private String tokenUrl;
    private String urlAcesso;
    private Boolean ativo;
    private Boolean acessoLiberado;
    private OffsetDateTime publicadoEm;
    private OffsetDateTime expiraEm;
    private Integer views;
}
