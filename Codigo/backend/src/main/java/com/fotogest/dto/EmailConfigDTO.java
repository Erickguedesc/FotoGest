package com.fotogest.dto;

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
    private String emailFotografaAvisos;
    private Boolean enviarAlbumPublicado;
    private Boolean avisarSelecaoRecebida;
    private Boolean enviarConfirmacaoSelecaoCliente;
    private Boolean enviarMudancaStatus;
    private String mensagemAlbumPublicado;
    private String mensagemSelecaoRecebida;
    private Boolean smtpConfigurado;
    private Boolean envioDisponivel;
    private String motivoIndisponivel;
}
