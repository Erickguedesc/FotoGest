package com.olhari.repository;

import com.olhari.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, UUID> {
    Optional<Album> findByTokenUrl(String tokenUrl);
}

