package com.fotolhar.repository;

import com.fotolhar.model.Foto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FotoRepository extends JpaRepository<Foto, UUID> {

    List<Foto> findByEnsaioId(UUID ensaioId);

    List<Foto> findByEnsaioClienteFotografaId(UUID fotografaId);

    List<Foto> findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(UUID ensaioId);

    int countByEnsaioId(UUID ensaioId);

    boolean existsByEnsaioIdAndEhCapaTrue(UUID ensaioId);
}
