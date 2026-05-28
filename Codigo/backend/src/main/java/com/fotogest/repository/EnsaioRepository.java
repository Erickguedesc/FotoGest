package com.fotogest.repository;

import com.fotogest.model.Ensaio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface EnsaioRepository extends JpaRepository<Ensaio, UUID>,
        JpaSpecificationExecutor<Ensaio> {
}