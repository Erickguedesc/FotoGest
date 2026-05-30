package com.fotogest.repository;

import com.fotogest.model.SelecaoFoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SelecaoFotoRepository extends JpaRepository<SelecaoFoto, UUID> {

    boolean existsByAlbumId(UUID albumId);

    List<SelecaoFoto> findByAlbumId(UUID albumId);

    void deleteByAlbumId(UUID albumId);

    void deleteByFotoId(UUID fotoId);
}
