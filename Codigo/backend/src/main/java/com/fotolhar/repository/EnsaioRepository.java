package com.fotolhar.repository;

import com.fotolhar.model.Ensaio;
import com.fotolhar.enums.StatusEnsaio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnsaioRepository extends JpaRepository<Ensaio, UUID>,
        JpaSpecificationExecutor<Ensaio> {

    List<Ensaio> findByDataEnsaioBetweenAndStatusNotOrderByDataEnsaioAsc(
            OffsetDateTime inicio,
            OffsetDateTime fim,
            StatusEnsaio status
    );

    Optional<Ensaio> findByIdAndClienteFotografaId(UUID id, UUID fotografaId);

    List<Ensaio> findByClienteFotografaId(UUID fotografaId);

    List<Ensaio> findByClienteFotografaIdAndDataEnsaioBetweenAndStatusNotOrderByDataEnsaioAsc(
            UUID fotografaId,
            OffsetDateTime inicio,
            OffsetDateTime fim,
            StatusEnsaio status
    );
}
