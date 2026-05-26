package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "configuracao_email")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracaoEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fotografa_id", nullable = false, unique = true)
    private Fotografa fotografa;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = false;

    @Column(name = "nome_remetente", length = 120)
    private String nomeRemetente;

    @Column(name = "email_resposta", length = 180)
    private String emailResposta;

    @Column(name = "email_fotografa_avisos", length = 180)
    private String emailFotografaAvisos;

    @Builder.Default
    @Column(name = "enviar_album_publicado", nullable = false)
    private Boolean enviarAlbumPublicado = true;

    @Builder.Default
    @Column(name = "avisar_selecao_recebida", nullable = false)
    private Boolean avisarSelecaoRecebida = true;

    @Builder.Default
    @Column(name = "enviar_mudanca_status", nullable = false)
    private Boolean enviarMudancaStatus = false;

    @Column(name = "mensagem_album_publicado", columnDefinition = "TEXT")
    private String mensagemAlbumPublicado;

    @Column(name = "mensagem_selecao_recebida", columnDefinition = "TEXT")
    private String mensagemSelecaoRecebida;
}
