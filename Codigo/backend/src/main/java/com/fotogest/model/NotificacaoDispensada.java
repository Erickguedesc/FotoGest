package com.fotogest.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "notificacao_dispensada",
        uniqueConstraints = @UniqueConstraint(columnNames = {"fotografa_id", "chave"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificacaoDispensada {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fotografa_id", nullable = false)
    private Fotografa fotografa;

    @Column(nullable = false, length = 180)
    private String chave;

    @Column(name = "dispensada_em", nullable = false)
    private OffsetDateTime dispensadaEm;

    @PrePersist
    protected void onCreate() {
        if (dispensadaEm == null) {
            dispensadaEm = OffsetDateTime.now();
        }
    }
}
