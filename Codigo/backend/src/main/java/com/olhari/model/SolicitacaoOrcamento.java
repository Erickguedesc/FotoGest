package com.olhari.model;

import com.olhari.enums.StatusLead;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Pedidos de orçamento vindos do formulário do site (RF12).
 * A fotógrafa vê esses pedidos na tela de Solicitações e pode
 * marcar como Atendido ou gerar um pré-contrato a partir deles.
 */
@Entity
@Table(name = "solicitacao_orcamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitacaoOrcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_cliente", nullable = false, length = 200)
    private String nomeCliente;

    @Column(nullable = false, length = 30)
    private String whatsapp;

    @Column(name = "tipo_ensaio", nullable = false, length = 80)
    private String tipoEnsaio;

    /** Data que o cliente quer para o ensaio (pode ser nulo) */
    @Column(name = "data_desejada")
    private LocalDate dataDesejada;

    /** Em_Solicitacao ou Atendido (RF08) */
    @Enumerated(EnumType.STRING)
    @Column(name = "status_lead", nullable = false,
            columnDefinition = "status_lead")
    @Builder.Default
    private StatusLead statusLead = StatusLead.EM_SOLICITACAO;

    @Column(name = "recebido_em", updatable = false)
    private OffsetDateTime recebidoEm;

    @PrePersist
    protected void onCreate() {
        recebidoEm = OffsetDateTime.now();
    }
}