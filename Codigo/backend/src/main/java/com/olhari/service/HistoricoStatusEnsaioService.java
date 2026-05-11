package com.olhari.service;

import com.olhari.dto.HistoricoStatusEnsaioResponse;
import com.olhari.model.HistoricoStatusEnsaio;
import com.olhari.repository.EnsaioRepository;
import com.olhari.repository.HistoricoStatusEnsaioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HistoricoStatusEnsaioService {

    private final HistoricoStatusEnsaioRepository historicoRepository;
    private final EnsaioRepository ensaioRepository;

    @Transactional(readOnly = true)
    public List<HistoricoStatusEnsaioResponse> listarPorEnsaio(UUID ensaioId) {
        ensaioRepository.findById(ensaioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ensaio não encontrado"
                ));

        return historicoRepository.findByEnsaioIdOrderByAlteradoEmAsc(ensaioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private HistoricoStatusEnsaioResponse toResponse(HistoricoStatusEnsaio historico) {
        return HistoricoStatusEnsaioResponse.builder()
                .id(historico.getId())
                .ensaioId(historico.getEnsaio().getId())
                .status(historico.getStatus())
                .alteradoEm(historico.getAlteradoEm())
                .build();
    }
}