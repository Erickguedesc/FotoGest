package com.fotolhar.service;

import com.fotolhar.dto.HistoricoStatusEnsaioResponse;
import com.fotolhar.model.HistoricoStatusEnsaio;
import com.fotolhar.repository.EnsaioRepository;
import com.fotolhar.repository.HistoricoStatusEnsaioRepository;
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
    private final UsuarioContextService usuarioContextService;

    @Transactional(readOnly = true)
    public List<HistoricoStatusEnsaioResponse> listarPorEnsaio(UUID ensaioId) {
        ensaioRepository.findByIdAndClienteUsuarioId(
                        ensaioId,
                        usuarioContextService.getUsuarioLogado().getId()
                )
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
