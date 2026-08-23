package com.fotolhar.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.fotolhar.enums.MarcaDaguaPosicao;
import com.fotolhar.enums.MarcaDaguaTamanho;

import com.fotolhar.enums.MarcaDaguaTipo;
import com.fotolhar.enums.MarcaDaguaFonte;
import com.fotolhar.enums.MarcaDaguaCor;
import com.fotolhar.enums.MarcaDaguaEstilo;
import com.fotolhar.enums.MarcaDaguaTextoModo;

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
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

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

    @Column(name = "marca_dagua_texto", columnDefinition = "TEXT")
private String marcaDaguaTexto;

    @Builder.Default
    @Column(name = "marca_dagua_ativa", nullable = false)
    private Boolean marcaDaguaAtiva = false;

@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "marca_dagua_posicao", length = 40)
private MarcaDaguaPosicao marcaDaguaPosicao = MarcaDaguaPosicao.INFERIOR_DIREITA;

@Builder.Default
@Column(name = "marca_dagua_opacidade")
private Integer marcaDaguaOpacidade = 35;

@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "marca_dagua_tamanho", length = 20)
private MarcaDaguaTamanho marcaDaguaTamanho = MarcaDaguaTamanho.MEDIA;

@Builder.Default
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


@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "marca_dagua_tipo", length = 20)
private MarcaDaguaTipo marcaDaguaTipo = MarcaDaguaTipo.IMAGEM;

@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "marca_dagua_fonte", length = 30)
private MarcaDaguaFonte marcaDaguaFonte = MarcaDaguaFonte.MODERNA;

@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "marca_dagua_cor", length = 20)
private MarcaDaguaCor marcaDaguaCor = MarcaDaguaCor.BRANCO;

@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "marca_dagua_estilo", length = 20)
private MarcaDaguaEstilo marcaDaguaEstilo = MarcaDaguaEstilo.NORMAL;

@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "marca_dagua_texto_modo", length = 20)
private MarcaDaguaTextoModo marcaDaguaTextoModo = MarcaDaguaTextoModo.REPETIDA;

}

// para alterar configuraçes do perfil
