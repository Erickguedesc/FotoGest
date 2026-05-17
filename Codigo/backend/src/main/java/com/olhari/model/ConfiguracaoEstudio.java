package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "configuracao_estudio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracaoEstudio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fotografa_id", nullable = false, unique = true)
    private Fotografa fotografa;

    @Column(name = "nome_estudio", length = 160)
    private String nomeEstudio;

    @Column(name = "nome_comercial", length = 160)
    private String nomeComercial;

    @Column(length = 200)
    private String email;

    @Column(length = 30)
    private String telefone;

    @Column(length = 120)
    private String instagram;

    @Column(length = 120)
    private String cidade;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    @Column(length = 20)
    private String cnpj;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

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

// para alterar configuraçes do perfil 