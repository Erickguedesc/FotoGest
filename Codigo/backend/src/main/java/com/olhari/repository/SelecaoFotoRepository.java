package com.olhari.repository;

import com.olhari.model.SelecaoFoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SelecaoFotoRepository extends JpaRepository<SelecaoFoto, UUID> {

    boolean existsByAlbumId(UUID albumId);

    List<SelecaoFoto> findByAlbumId(UUID albumId);
}