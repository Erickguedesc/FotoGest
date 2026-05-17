package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "homepage_curso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomepageCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 160)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_url", nullable = false, columnDefinition = "TEXT")
    private String imagemUrl;

    @Column(name = "preco_texto", length = 80)
    private String precoTexto;

    @Column(name = "link_externo", nullable = false, columnDefinition = "TEXT")
    private String linkExterno;

    @Column(name = "texto_botao", nullable = false, length = 80)
    private String textoBotao;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(nullable = false)
    private Integer ordem;

    @Column(name = "criado_em", updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em")
    private OffsetDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = atualizadoEm = OffsetDateTime.now();
        if (ativo == null) ativo = true;
        if (ordem == null) ordem = 0;
        if (textoBotao == null || textoBotao.isBlank()) textoBotao = "Conhecer produto";
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = OffsetDateTime.now();
    }
}
