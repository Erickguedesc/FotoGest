package com.olhari.repository;

import com.olhari.model.PreferenciasSistema;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PreferenciasSistemaRepository extends JpaRepository<PreferenciasSistema, UUID> {
    Optional<PreferenciasSistema> findByFotografaId(UUID fotografaId);
}