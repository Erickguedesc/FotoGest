package com.fotolhar.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "modelo_contrato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModeloContrato {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 140)
    private String nome;

    @Column(name = "tipo_ensaio", length = 40)
    private String tipoEnsaio;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String clausulas;

    @Column(name = "texto_aceite", columnDefinition = "TEXT")
    private String textoAceite;

    @Builder.Default
    @Column(nullable = false)
    private Boolean padrao = false;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

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
