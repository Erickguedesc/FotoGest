package com.fotolhar.controller;

import com.fotolhar.dto.ModeloContratoDTO;
import com.fotolhar.dto.ModeloContratoRequest;
import com.fotolhar.service.ModeloContratoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/configuracoes/modelos-contrato")
@RequiredArgsConstructor
public class ModeloContratoController {

    private final ModeloContratoService modeloContratoService;

    @GetMapping
    public ResponseEntity<List<ModeloContratoDTO>> listar() {
        return ResponseEntity.ok(modeloContratoService.listarGarantindoPadrao());
    }

    @PostMapping
    public ResponseEntity<ModeloContratoDTO> criar(
            @RequestBody @Valid ModeloContratoRequest request
    ) {
        return ResponseEntity.ok(modeloContratoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModeloContratoDTO> atualizar(
            @PathVariable UUID id,
            @RequestBody @Valid ModeloContratoRequest request
    ) {
        return ResponseEntity.ok(modeloContratoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable UUID id) {
        modeloContratoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
