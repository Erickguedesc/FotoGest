package com.fotogest.repository;

import com.fotogest.model.ConfiguracaoEmail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConfiguracaoEmailRepository extends JpaRepository<ConfiguracaoEmail, UUID> {

    Optional<ConfiguracaoEmail> findByFotografaId(UUID fotografaId);
}
