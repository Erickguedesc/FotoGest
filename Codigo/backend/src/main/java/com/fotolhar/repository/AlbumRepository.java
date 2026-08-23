package com.fotolhar.repository;

import com.fotolhar.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AlbumRepository extends JpaRepository<Album, UUID> {

    Optional<Album> findByTokenUrl(String tokenUrl);

    Optional<Album> findByEnsaioId(UUID ensaioId);

    Optional<Album> findByEnsaioIdAndEnsaioClienteFotografaId(UUID ensaioId, UUID fotografaId);

    List<Album> findByEnsaioClienteFotografaId(UUID fotografaId);

    boolean existsByTokenUrl(String tokenUrl);
}
