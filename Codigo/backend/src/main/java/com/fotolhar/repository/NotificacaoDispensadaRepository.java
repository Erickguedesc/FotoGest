package com.fotolhar.repository;

import com.fotolhar.model.NotificacaoDispensada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificacaoDispensadaRepository extends JpaRepository<NotificacaoDispensada, UUID> {

    List<NotificacaoDispensada> findByUsuarioId(UUID usuarioId);

    Optional<NotificacaoDispensada> findByUsuarioIdAndChave(UUID usuarioId, String chave);

    void deleteByUsuarioIdAndExpiraEmBefore(UUID usuarioId, OffsetDateTime data);
}
