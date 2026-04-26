package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;


@Entity
@Table(name = "cliente")
@Getter
@Data // Gerencia Getters e Setters
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    @NotBlank(message = "O nome do cliente é obrigatório") // Adicione esta linha
    private String nome;

    @Column(unique = true, length = 200)
    @Email(message = "E-mail inválido")
    private String email;

    @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$", message = "Telefone inválido")
    @Column(length = 30)
    private String telefone;
   @Column(unique = true, length = 20)
    private String cpf;

    @Column(length = 120)
    private String cidade;

    /** Como o cliente conheceu a fotógrafa (ex: Instagram, Indicação) */
    @Column(length = 120)
    private String indicacao;

    /** Um cliente pode ter vários ensaios */
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Ensaio> ensaios = new ArrayList<>();

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