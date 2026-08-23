package com.fotolhar.repository;

import com.fotolhar.model.NotificacaoDispensada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificacaoDispensadaRepository extends JpaRepository<NotificacaoDispensada, UUID> {

    List<NotificacaoDispensada> findByFotografaId(UUID fotografaId);

    Optional<NotificacaoDispensada> findByFotografaIdAndChave(UUID fotografaId, String chave);
}
