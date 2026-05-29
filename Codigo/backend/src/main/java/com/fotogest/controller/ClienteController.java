package com.fotogest.controller;

import com.fotogest.dto.ClienteRequest;
import com.fotogest.dto.ClienteResponse;
import com.fotogest.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService service;

    @PostMapping
    public ClienteResponse criar(@RequestBody @Valid ClienteRequest request) {
        return service.criar(request);
    }

    @GetMapping
    public List<ClienteResponse> listar(@RequestParam(required = false) String busca) {
        return service.listar(busca);
    }

    @GetMapping("/{id}")
    public ClienteResponse buscar(@PathVariable UUID id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public ClienteResponse atualizar(@PathVariable UUID id,
            @RequestBody @Valid ClienteRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) {
        service.deletar(id);
    }

    @PatchMapping("/{id}/arquivar")
    public ClienteResponse arquivar(@PathVariable UUID id) {
        return service.arquivar(id);
    }

    @PatchMapping("/{id}/reativar")
    public ClienteResponse reativar(@PathVariable UUID id) {
        return service.reativar(id);
    }
}
