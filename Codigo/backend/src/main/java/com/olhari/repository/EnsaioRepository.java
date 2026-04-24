package com.olhari.repository;

import com.olhari.model.Ensaio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface EnsaioRepository extends JpaRepository<Ensaio, UUID> {
}