package com.olhari.controller;

import com.olhari.dto.HistoricoStatusEnsaioResponse;
import com.olhari.service.HistoricoStatusEnsaioService;
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