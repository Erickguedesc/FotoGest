package com.fotogest.repository;

import com.fotogest.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AlbumRepository extends JpaRepository<Album, UUID> {

    Optional<Album> findByTokenUrl(String tokenUrl);

    Optional<Album> findByEnsaioId(UUID ensaioId);

    boolean existsByTokenUrl(String tokenUrl);
}