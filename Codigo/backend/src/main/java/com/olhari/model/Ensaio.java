package com.olhari.model;

import com.olhari.enums.StatusEnsaio;
import com.olhari.enums.TipoEnsaio;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;
// Adicione esses imports no topo do arquivo
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "ensaio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ensaio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Qual cliente pertence este ensaio */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    /** Newborn, Gestante, Familia... */
  // DEPOIS ✅
@Enumerated(EnumType.STRING)
@JdbcTypeCode(SqlTypes.NAMED_ENUM)
@Column(nullable = false, columnDefinition = "tipo_ensaio")
private TipoEnsaio tipo;

@Enumerated(EnumType.STRING)
@JdbcTypeCode(SqlTypes.NAMED_ENUM)
@Column(nullable = false, columnDefinition = "status_ensaio")
@Builder.Default
private StatusEnsaio status = StatusEnsaio.AGENDADO;

    @Column(name = "data_ensaio", nullable = false)
    private OffsetDateTime dataEnsaio;

    @Column(nullable = false, length = 300)
    private String local;

    /** Quantidade de fotos incluídas no pacote */
   @Column(name = "qtd_fotos_pacote", nullable = false)
   private Integer qtdFotosPacote;

// ✅ Sem default — o @NotNull no DTO já garante que sempre vem valor
@Column(name = "valor_pacote", precision = 10, scale = 2, nullable = false)
private BigDecimal valorPacote;

    /** Valor por foto além do pacote (RF11) */
     @Column(name = "valor_foto_extra", precision = 10, scale = 2)
     private BigDecimal valorFotoExtra;

 //✅ Sem default — fotógrafa decide explicitamente
@Column(name = "cobrar_foto_extra")
private Boolean cobrarFotoExtra;

    @Column(name = "valor_final_ensaio", precision = 10, scale = 2)
    private BigDecimal valorFinalEnsaio;

    @Builder.Default
    @Column(name = "status_valores", length = 30)
    private String statusValores = "NAO_INFORMADO";

    @Column(name = "observacao_valores", columnDefinition = "TEXT")
    private String observacaoValores;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    /** Progresso de 0 a 100 — atualizado manualmente (R03) */
    @Builder.Default
    @Column(nullable = false)
    private Short progresso = 0;

    /** Fotos do ensaio */
    @OneToMany(mappedBy = "ensaio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Foto> fotos = new ArrayList<>();

    /** Álbum online (criado quando fotógrafa publicar) */
    @OneToOne(mappedBy = "ensaio", cascade = CascadeType.ALL, orphanRemoval = true)
    private Album album;

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
