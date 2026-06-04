package com.fotogest.repository;

import com.fotogest.model.ModeloContrato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModeloContratoRepository extends JpaRepository<ModeloContrato, UUID> {
    List<ModeloContrato> findByFotografaIdOrderByPadraoDescAtualizadoEmDesc(UUID fotografaId);

    List<ModeloContrato> findByFotografaIdAndAtivoTrueOrderByPadraoDescAtualizadoEmDesc(UUID fotografaId);

    Optional<ModeloContrato> findByIdAndFotografaId(UUID id, UUID fotografaId);

    boolean existsByFotografaId(UUID fotografaId);
}
