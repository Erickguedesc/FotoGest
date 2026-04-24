package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Registra cada foto que o cliente marcou como favorita na galeria.
 * Quando finalizada = true, a seleção não pode mais ser alterada (RF07).
 * O valor excedente é calculado automaticamente pelo sistema (RF11).
 */
@Entity
@Table(
    name = "selecao_foto",
    uniqueConstraints = @UniqueConstraint(columnNames = {"album_id", "foto_id"})
)
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

    /** Quando true, o cliente confirmou e não pode mais alterar (RF07) */
    @Builder.Default
    @Column(nullable = false)
    private Boolean finalizada = false;

    @Column(name = "selecionada_em", updatable = false)
    private OffsetDateTime selecionadaEm;

    /** Total de fotos selecionadas no momento da finalização */
    @Builder.Default
    @Column(name = "total_selecionadas", nullable = false)
    private Integer totalSelecionadas = 0;

    /** Valor extra calculado se excedeu o pacote (RF11) */
    @Builder.Default
    @Column(name = "valor_excedente", precision = 10, scale = 2)
    private BigDecimal valorExcedente = BigDecimal.ZERO;

    @PrePersist
    protected void onCreate() {
        selecionadaEm = OffsetDateTime.now();
    }
}