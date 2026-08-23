package com.fotolhar.repository;

import com.fotolhar.model.ConfiguracaoEstudio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConfiguracaoEstudioRepository extends JpaRepository<ConfiguracaoEstudio, UUID> {
    Optional<ConfiguracaoEstudio> findByFotografaId(UUID fotografaId);
}