package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.olhari.enums.MarcaDaguaPosicao;
import com.olhari.enums.MarcaDaguaTamanho;

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

        @Column(name = "marca_dagua_url", columnDefinition = "TEXT")
    private String marcaDaguaUrl;

    @Column(name = "marca_dagua_public_id", columnDefinition = "TEXT")
    private String marcaDaguaPublicId;

    @Builder.Default
    @Column(name = "marca_dagua_ativa", nullable = false)
    private Boolean marcaDaguaAtiva = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "marca_dagua_posicao", length = 40)
    private MarcaDaguaPosicao marcaDaguaPosicao = MarcaDaguaPosicao.INFERIOR_DIREITA;

    @Column(name = "marca_dagua_opacidade")
    private Integer marcaDaguaOpacidade = 35;

    @Enumerated(EnumType.STRING)
    @Column(name = "marca_dagua_tamanho", length = 20)
    private MarcaDaguaTamanho marcaDaguaTamanho = MarcaDaguaTamanho.MEDIA;

    @Column(name = "marca_dagua_margem")
    private Integer marcaDaguaMargem = 30;

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