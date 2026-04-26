package com.olhari.repository;

import com.olhari.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    Optional<Cliente> findByEmail(String email);

    // Adicione esta linha:
    Optional<Cliente> findByCpf(String cpf); 
}