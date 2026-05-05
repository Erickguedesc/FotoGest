package com.olhari.controller;

import com.olhari.dto.AlbumAcessoRequest;
import com.olhari.dto.SelecaoRequest;
import com.olhari.service.AlbumPublicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/album")
@RequiredArgsConstructor
public class AlbumPublicoController {

    private final AlbumPublicoService service;

    // acessar álbum (cliente)
    @PostMapping("/{token}/acessar")
    public ResponseEntity<?> acessar(
            @PathVariable String token,
            @RequestBody AlbumAcessoRequest request) {
        return ResponseEntity.ok(service.acessarAlbum(token, request.getSenha()));
    }

    // enviar seleção
    @PostMapping("/{token}/selecao")
    public ResponseEntity<?> selecionar(
            @PathVariable String token,
            @RequestBody SelecaoRequest request) {
        return ResponseEntity.ok(service.selecionarFotos(token, request.getFotosIds()));
    }

    // ver seleção (fotógrafa)
    @GetMapping("/{token}/selecao")
    public ResponseEntity<?> buscarSelecao(@PathVariable String token) {
        return ResponseEntity.ok(service.buscarSelecao(token));
    }

    // dados públicos do álbum
    @GetMapping("/{token}")
    public ResponseEntity<?> dados(@PathVariable String token) {
        return ResponseEntity.ok(service.dadosPublicos(token));
    }
}