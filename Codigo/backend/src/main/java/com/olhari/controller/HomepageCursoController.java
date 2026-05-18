package com.olhari.controller;

import com.olhari.dto.HomepageCursoRequest;
import com.olhari.dto.HomepageCursoResponse;
import com.olhari.service.HomepageCursoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/homepage/cursos")
@RequiredArgsConstructor
public class HomepageCursoController {

    private final HomepageCursoService service;

    @GetMapping
    public List<HomepageCursoResponse> listarAtivos() {
        return service.listarAtivos();
    }

    @GetMapping("/admin")
    public List<HomepageCursoResponse> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public HomepageCursoResponse criar(@RequestBody @Valid HomepageCursoRequest request) {
        return service.criar(request);
    }

    @PutMapping("/{id}")
    public HomepageCursoResponse atualizar(
            @PathVariable UUID id,
            @RequestBody @Valid HomepageCursoRequest request
    ) {
        return service.atualizar(id, request);
    }

    @PatchMapping("/{id}/ocultar")
    public HomepageCursoResponse ocultar(@PathVariable UUID id) {
        return service.ocultar(id);
    }

    @PatchMapping("/{id}/ativar")
    public HomepageCursoResponse ativar(@PathVariable UUID id) {
        return service.ativar(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
