package com.fotolhar.repository;

import com.fotolhar.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    boolean existsByFotografaIdAndEmail(UUID fotografaId, String email);

    boolean existsByFotografaIdAndCpf(UUID fotografaId, String cpf);

    Optional<Cliente> findByFotografaIdAndEmail(UUID fotografaId, String email);

    Optional<Cliente> findByFotografaIdAndCpf(UUID fotografaId, String cpf);

    Optional<Cliente> findByIdAndFotografaId(UUID id, UUID fotografaId);

    List<Cliente> findByFotografaIdOrderByNomeAsc(UUID fotografaId);

    List<Cliente> findByFotografaIsNull();

    @Query("""
            SELECT c FROM Cliente c
            WHERE c.fotografa.id = :fotografaId
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
            @Param("fotografaId") UUID fotografaId,
            @Param("busca") String busca,
            @Param("digitos") String digitos
    );
}
