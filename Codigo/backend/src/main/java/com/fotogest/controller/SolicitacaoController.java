package com.fotogest.controller;

import com.fotogest.dto.SolicitacaoRequest;
import com.fotogest.dto.SolicitacaoResponse;
import com.fotogest.enums.StatusLead;
import com.fotogest.service.SolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitacaoResponse criar(
            @RequestBody @Valid SolicitacaoRequest request
    ) {
        return service.criar(request);
    }

    @GetMapping
    public List<SolicitacaoResponse> listar() {
        return service.listar();
    }

    @PatchMapping("/{id}/status")
    public SolicitacaoResponse atualizarStatus(
            @PathVariable UUID id,
            @RequestParam StatusLead status
    ) {
        return service.atualizarStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable UUID id) {
        service.deletar(id);
    }
}