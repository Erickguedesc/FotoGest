package com.olhari.controller;

import com.olhari.dto.*;
import com.olhari.service.AlbumPublicoService;
import com.olhari.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/album") // 🔥 PADRÃO CORRETO
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlbumController {

    private final AlbumService albumService; // criação de álbum (BACK 1)
    private final AlbumPublicoService albumPublicoService; // acesso público (BACK 2)

    @PostMapping("/gerar/{ensaioId}")
    public ResponseEntity<AlbumResponseDTO> criarAlbum(@PathVariable UUID ensaioId) {
        AlbumResponseDTO response = albumService.gerarAlbumCompleto(ensaioId);
        return ResponseEntity.ok(response);
    }

    // - ACESSAR COM SENHA
    @PostMapping("/{token}/acessar")
    public ResponseEntity<List<FotoPublicaResponse>> acessarAlbum(
            @PathVariable String token,
            @RequestBody AlbumAcessoRequest request) {
        return ResponseEntity.ok(
                albumPublicoService.acessarAlbum(token, request.getSenha()));
    }

    // DADOS PÚBLICOS DO ÁLBUM
    @GetMapping("/{token}")
    public ResponseEntity<AlbumPublicoResponse> dadosPublicos(@PathVariable String token) {
        return ResponseEntity.ok(
                albumPublicoService.dadosPublicos(token));
    }

    // SELEÇÃO DE FOTOS (CLIENTE)
    @PostMapping("/{token}/selecao")
    public ResponseEntity<SelecaoResponse> selecionar(
            @PathVariable String token,
            @RequestBody SelecaoRequest request) {
        return ResponseEntity.ok(
                albumPublicoService.selecionarFotos(token, request.getFotosIds()));
    }

    // CONSULTAR SELEÇÃO (FOTÓGRAFA)
    @GetMapping("/{token}/selecao")
    public ResponseEntity<SelecaoResponse> buscar(@PathVariable String token) {
        return ResponseEntity.ok(
                albumPublicoService.buscarSelecao(token));
    }
}