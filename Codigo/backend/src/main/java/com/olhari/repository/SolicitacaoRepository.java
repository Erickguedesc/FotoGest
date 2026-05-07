package com.olhari.repository;

import com.olhari.model.SolicitacaoOrcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SolicitacaoRepository extends JpaRepository<SolicitacaoOrcamento, UUID> {
}