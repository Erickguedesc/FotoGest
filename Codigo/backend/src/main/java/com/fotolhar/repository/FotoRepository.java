package com.fotolhar.repository;

import com.fotolhar.model.Foto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface FotoRepository extends JpaRepository<Foto, UUID> {

    List<Foto> findByEnsaioId(UUID ensaioId);

    List<Foto> findByEnsaioClienteUsuarioId(UUID usuarioId);

    List<Foto> findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(UUID ensaioId);

    List<Foto> findByEnsaioIdInOrderByOrdemAscEnviadaEmAsc(Collection<UUID> ensaioIds);

    int countByEnsaioId(UUID ensaioId);

    boolean existsByEnsaioIdAndEhCapaTrue(UUID ensaioId);
}
