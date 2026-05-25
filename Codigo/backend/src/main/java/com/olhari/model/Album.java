package com.olhari.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "album")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Cada ensaio tem no máximo 1 álbum */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ensaio_id", nullable = false, unique = true)
    private Ensaio ensaio;

    /**
     * Token gerado automaticamente para a URL pública.
     * Exemplo: olhari.com/album/ana-clara-3f8a (RF05)
     */

    @Column(name = "acesso_liberado")
    @Builder.Default
    private Boolean acessoLiberado = false;

    @Column(name = "token_url", nullable = false, unique = true, length = 60)
    private String tokenUrl;

    /** Senha de acesso armazenada com BCrypt (RNF05) */
    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @Column(name = "publicado_em")
    private OffsetDateTime publicadoEm;

    /** Opcional: data de expiração do link */
    @Column(name = "expira_em")
    private OffsetDateTime expiraEm;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    @Builder.Default
    @Column(nullable = false)
    private Integer views = 0;

    /** Fotos que o cliente favoritou (RF06, RF07) */
    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SelecaoFoto> selecoes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        // 1. Define a data de publicação como 'agora'
        this.publicadoEm = OffsetDateTime.now();

        // 2. Se o token estiver vazio, gera um código aleatório de 8 letras/números
        if (this.tokenUrl == null) {
            this.tokenUrl = UUID.randomUUID().toString().substring(0, 8);
        }

        // 3. Define a expiração para 30 dias a partir de hoje (opcional)
        if (this.expiraEm == null) {
            this.expiraEm = OffsetDateTime.now().plusDays(30);
        }
    }
}
