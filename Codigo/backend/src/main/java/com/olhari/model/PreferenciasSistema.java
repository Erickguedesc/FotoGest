package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "preferencias_sistema")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenciasSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fotografa_id", nullable = false, unique = true)
    private Fotografa fotografa;

    @Column(name = "qtd_fotos_padrao")
    private Integer qtdFotosPadrao;

    @Column(name = "valor_foto_extra_padrao", precision = 10, scale = 2)
    private BigDecimal valorFotoExtraPadrao;

    @Column(name = "prazo_expiracao_album_dias")
    private Integer prazoExpiracaoAlbumDias;

    @Column(name = "cidade_padrao", length = 120)
    private String cidadePadrao;

    @Column(name = "mensagem_envio_album", columnDefinition = "TEXT")
    private String mensagemEnvioAlbum;

    @Column(name = "mensagem_selecao_recebida", columnDefinition = "TEXT")
    private String mensagemSelecaoRecebida;

    @Column(name = "criado_em", updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em")
    private OffsetDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = atualizadoEm = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = OffsetDateTime.now();
    }
}