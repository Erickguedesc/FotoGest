package com.olhari.repository;

import com.olhari.model.Fotografa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FotografaRepository extends JpaRepository<Fotografa, UUID> {
    Optional<Fotografa> findByEmail(String email);
}

