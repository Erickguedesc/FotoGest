package com.fotolhar.controller;

import com.fotolhar.dto.EnsaioRequest;
import com.fotolhar.dto.EnsaioConflitoAgendaResponse;
import com.fotolhar.dto.EnsaioNotasInternasRequest;
import com.fotolhar.dto.EnsaioObservacoesRequest;
import com.fotolhar.dto.EnsaioResponse;
import com.fotolhar.dto.EnsaioStatusRequest;
import com.fotolhar.service.EnsaioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Adiciona imports no topo
import com.fotolhar.enums.StatusEnsaio;
import com.fotolhar.enums.TipoEnsaio;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ensaios")
@RequiredArgsConstructor
public class EnsaioController {

    private final EnsaioService service;

    @PostMapping
    public EnsaioResponse criar(@RequestBody @Valid EnsaioRequest request) {
        return service.criar(request);
    }

   // DEPOIS ✅
@GetMapping
public List<EnsaioResponse> listar(
        @RequestParam(required = false) StatusEnsaio status,
        @RequestParam(required = false) TipoEnsaio tipo,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dataInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dataFim,
        @RequestParam(required = false) String clienteNome
) {
    return service.listar(status, tipo, dataInicio, dataFim, clienteNome);
}

    @GetMapping("/{id}")
    public EnsaioResponse buscar(@PathVariable UUID id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/conflitos")
    public EnsaioConflitoAgendaResponse buscarConflitoAgenda(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dataEnsaio
    ) {
        return service.buscarConflitoAgenda(dataEnsaio);
    }

    @PutMapping("/{id}")
    public EnsaioResponse atualizar(@PathVariable UUID id,
            @RequestBody @Valid EnsaioRequest request) {
        return service.atualizar(id, request);
    }

  // DEPOIS ✅
@DeleteMapping("/{id}")
public ResponseEntity<?> deletar(@PathVariable UUID id) {
    try {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    } catch (IllegalStateException e) {
        return ResponseEntity.badRequest().body(
            java.util.Map.of("erro", e.getMessage())
        );
    }
}

    @PatchMapping("/{id}/status")
    public EnsaioResponse atualizarStatus(@PathVariable UUID id,
            @RequestBody @Valid EnsaioStatusRequest request) {
        return service.atualizarStatus(id, request);
    }

    @PatchMapping("/{id}/observacoes")
    public EnsaioResponse atualizarObservacoes(@PathVariable UUID id,
            @RequestBody @Valid EnsaioObservacoesRequest request) {
        return service.atualizarObservacoes(id, request);
    }

    @PatchMapping("/{id}/notas-internas")
    public EnsaioResponse atualizarNotasInternas(@PathVariable UUID id,
            @RequestBody @Valid EnsaioNotasInternasRequest request) {
        return service.atualizarNotasInternas(id, request);
    }

    @PatchMapping("/{id}/aprovar-selecao")
    public EnsaioResponse aprovarSelecao(@PathVariable UUID id) {
        return service.aprovarSelecao(id);
    }
}
