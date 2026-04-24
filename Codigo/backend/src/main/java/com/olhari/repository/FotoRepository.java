package com.olhari.repository;

import com.olhari.model.Foto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface FotoRepository extends JpaRepository<Foto, UUID> {
    // Aqui o Spring Data JPA faz a mágica de criar o SQL sozinho
}