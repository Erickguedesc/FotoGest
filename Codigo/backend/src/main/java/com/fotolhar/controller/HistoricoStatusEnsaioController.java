package com.fotolhar.controller;

import com.fotolhar.dto.HistoricoStatusEnsaioResponse;
import com.fotolhar.service.HistoricoStatusEnsaioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ensaios")
@RequiredArgsConstructor
public class HistoricoStatusEnsaioController {

    private final HistoricoStatusEnsaioService historicoStatusEnsaioService;

    @GetMapping("/{ensaioId}/historico-status")
    public ResponseEntity<List<HistoricoStatusEnsaioResponse>> listarHistorico(
            @PathVariable UUID ensaioId
    ) {
        return ResponseEntity.ok(
                historicoStatusEnsaioService.listarPorEnsaio(ensaioId)
        );
    }
}