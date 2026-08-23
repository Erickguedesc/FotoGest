package com.fotolhar.repository;

import com.fotolhar.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    boolean existsByUsuarioIdAndEmail(UUID usuarioId, String email);

    boolean existsByUsuarioIdAndCpf(UUID usuarioId, String cpf);

    Optional<Cliente> findByUsuarioIdAndEmail(UUID usuarioId, String email);

    Optional<Cliente> findByUsuarioIdAndCpf(UUID usuarioId, String cpf);

    Optional<Cliente> findByIdAndUsuarioId(UUID id, UUID usuarioId);

    List<Cliente> findByUsuarioIdOrderByNomeAsc(UUID usuarioId);

    List<Cliente> findByUsuarioIsNull();

    @Query("""
            SELECT c FROM Cliente c
            WHERE c.usuario.id = :usuarioId
              AND (
                   LOWER(c.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
                OR LOWER(COALESCE(c.email, '')) LIKE LOWER(CONCAT('%', :busca, '%'))
                OR (:digitos <> '' AND REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(c.telefone, ''), ' ', ''), '-', ''), '(', ''), ')', '')
                     LIKE CONCAT('%', :digitos, '%')
                   )
              )
            ORDER BY c.nome ASC
            """)
    List<Cliente> buscarPorTermo(
            @Param("usuarioId") UUID usuarioId,
            @Param("busca") String busca,
            @Param("digitos") String digitos
    );
}
