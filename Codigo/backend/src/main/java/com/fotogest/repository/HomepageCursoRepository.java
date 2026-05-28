package com.fotogest.repository;

import com.fotogest.model.HomepageCurso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HomepageCursoRepository extends JpaRepository<HomepageCurso, UUID> {
    List<HomepageCurso> findByAtivoTrueOrderByOrdemAscTituloAsc();
    List<HomepageCurso> findAllByOrderByOrdemAscTituloAsc();
}
