package com.olhari.controller;

import com.olhari.dto.SolicitacaoRequest;
import com.olhari.dto.SolicitacaoResponse;
import com.olhari.enums.StatusLead;
import com.olhari.service.SolicitacaoService;
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

    // ── POST /solicitacoes — público, chamado pela homepage ──────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitacaoResponse criar(@RequestBody @Valid SolicitacaoRequest request) {
        return service.criar(request);
    }

    // ── GET /solicitacoes — fotógrafa lista todas as solicitações ────────────
    @GetMapping
    public List<SolicitacaoResponse> listar() {
        return service.listar();
    }

    // ── PATCH /solicitacoes/{id}/status — fotógrafa atualiza o status ────────
    @PatchMapping("/{id}/status")
    public SolicitacaoResponse atualizarStatus(
            @PathVariable UUID id,
            @RequestParam StatusLead status) {
        return service.atualizarStatus(id, status);
    }
}
