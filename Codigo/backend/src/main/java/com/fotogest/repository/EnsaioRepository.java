package com.fotogest.repository;

import com.fotogest.model.Ensaio;
import com.fotogest.enums.StatusEnsaio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface EnsaioRepository extends JpaRepository<Ensaio, UUID>,
        JpaSpecificationExecutor<Ensaio> {

    List<Ensaio> findByDataEnsaioBetweenAndStatusNotOrderByDataEnsaioAsc(
            OffsetDateTime inicio,
            OffsetDateTime fim,
            StatusEnsaio status
    );
}
