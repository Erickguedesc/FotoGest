package com.olhari.service;

import com.olhari.dto.SolicitacaoRequest;
import com.olhari.dto.SolicitacaoResponse;
import com.olhari.enums.StatusLead;
import com.olhari.model.SolicitacaoOrcamento;
import com.olhari.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository repository;

    public SolicitacaoResponse criar(SolicitacaoRequest request) {
        SolicitacaoOrcamento solicitacao = SolicitacaoOrcamento.builder()
                .nomeCliente(request.getNomeCliente())
                .whatsapp(request.getWhatsapp())
                .tipoEnsaio(request.getTipoEnsaio())
                .dataDesejada(request.getDataDesejada())
                .build();

        return toResponse(repository.save(solicitacao));
    }

    public List<SolicitacaoResponse> listar() {
        return repository.findAll()
                .stream()
                .sorted((a, b) -> b.getRecebidoEm().compareTo(a.getRecebidoEm()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SolicitacaoResponse atualizarStatus(UUID id, StatusLead novoStatus) {
        SolicitacaoOrcamento solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada"
                ));

        solicitacao.setStatusLead(novoStatus);

        return toResponse(repository.save(solicitacao));
    }

    public void deletar(UUID id) {
        SolicitacaoOrcamento solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada"
                ));

        if (solicitacao.getStatusLead() != StatusLead.ATENDIDO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Só é possível apagar solicitações atendidas."
            );
        }

        repository.delete(solicitacao);
    }

    private SolicitacaoResponse toResponse(SolicitacaoOrcamento s) {
        return SolicitacaoResponse.builder()
                .id(s.getId())
                .nomeCliente(s.getNomeCliente())
                .whatsapp(s.getWhatsapp())
                .tipoEnsaio(s.getTipoEnsaio())
                .dataDesejada(s.getDataDesejada())
                .statusLead(s.getStatusLead())
                .recebidoEm(s.getRecebidoEm())
                .build();
    }
}