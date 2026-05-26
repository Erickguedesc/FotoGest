package com.olhari.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailConfigDTO {
    private UUID id;
    private Boolean ativo;
    private String nomeRemetente;
    private String emailResposta;
    private String emailFotografaAvisos;
    private Boolean enviarAlbumPublicado;
    private Boolean avisarSelecaoRecebida;
    private Boolean enviarMudancaStatus;
    private String mensagemAlbumPublicado;
    private String mensagemSelecaoRecebida;
}
