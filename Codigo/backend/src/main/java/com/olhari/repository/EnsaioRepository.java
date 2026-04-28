package com.olhari.repository;

import com.olhari.model.Ensaio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface EnsaioRepository extends JpaRepository<Ensaio, UUID>,
        JpaSpecificationExecutor<Ensaio> {
}