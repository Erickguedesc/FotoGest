package com.fotolhar.repository;

import com.fotolhar.model.ModeloContrato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModeloContratoRepository extends JpaRepository<ModeloContrato, UUID> {
    List<ModeloContrato> findByUsuarioIdOrderByPadraoDescAtualizadoEmDesc(UUID usuarioId);

    List<ModeloContrato> findByUsuarioIdAndAtivoTrueOrderByPadraoDescAtualizadoEmDesc(UUID usuarioId);

    Optional<ModeloContrato> findByIdAndUsuarioId(UUID id, UUID usuarioId);

    boolean existsByUsuarioId(UUID usuarioId);
}
