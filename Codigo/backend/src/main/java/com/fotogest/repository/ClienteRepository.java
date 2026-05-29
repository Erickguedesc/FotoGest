package com.fotogest.repository;

import com.fotogest.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    Optional<Cliente> findByEmail(String email);

    // Adicione esta linha:
    Optional<Cliente> findByCpf(String cpf); 

    @Query("""
            SELECT c FROM Cliente c
            WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
               OR LOWER(COALESCE(c.email, '')) LIKE LOWER(CONCAT('%', :busca, '%'))
               OR (:digitos <> '' AND REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(c.telefone, ''), ' ', ''), '-', ''), '(', ''), ')', '')
                    LIKE CONCAT('%', :digitos, '%')
                  )
            ORDER BY c.nome ASC
            """)
    List<Cliente> buscarPorTermo(@Param("busca") String busca, @Param("digitos") String digitos);
}
