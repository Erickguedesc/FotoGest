package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "selecao_foto", uniqueConstraints = @UniqueConstraint(columnNames = { "album_id", "foto_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelecaoFoto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Álbum ao qual esta seleção pertence */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    /** A foto que o cliente selecionou */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "foto_id", nullable = false)
    private Foto foto;

    /** Quando true, o cliente confirmou e não pode mais alterar */
    @Builder.Default
    @Column(nullable = false)
    private Boolean finalizada = false;

    @Column(name = "selecionada_em", updatable = false)
    private OffsetDateTime selecionadaEm;

    @Builder.Default
    @Column(name = "total_selecionadas", nullable = false)
    private Integer totalSelecionadas = 0;

    @Builder.Default
    @Column(name = "valor_excedente", precision = 10, scale = 2)
    private BigDecimal valorExcedente = BigDecimal.ZERO;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @PrePersist
    protected void onCreate() {
        selecionadaEm = OffsetDateTime.now();
    }
}
