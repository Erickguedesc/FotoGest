package com.fotolhar.controller;

import com.fotolhar.dto.NotificacaoResponse;
import com.fotolhar.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @GetMapping
    public List<NotificacaoResponse> listar() {
        return notificacaoService.listar();
    }

    @DeleteMapping("/{chave}")
    public ResponseEntity<Void> dispensar(@PathVariable String chave) {
        notificacaoService.dispensar(chave);

        return ResponseEntity.noContent().build();
    }
}
