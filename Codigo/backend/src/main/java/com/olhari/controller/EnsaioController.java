package com.olhari.controller;

import com.olhari.dto.EnsaioRequest;
import com.olhari.dto.EnsaioResponse;
import com.olhari.dto.EnsaioStatusRequest;
import com.olhari.service.EnsaioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Adiciona imports no topo
import com.olhari.enums.StatusEnsaio;
import com.olhari.enums.TipoEnsaio;
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
}