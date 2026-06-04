package com.fotogest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailConfigUpdateRequest {
    private Boolean ativo;
    private String nomeRemetente;
    private String emailFotografaAvisos;
    private Boolean enviarAlbumPublicado;
    private Boolean avisarSelecaoRecebida;
    private Boolean enviarConfirmacaoSelecaoCliente;
    private Boolean enviarMudancaStatus;
    private String mensagemAlbumPublicado;
    private String mensagemSelecaoRecebida;
}
