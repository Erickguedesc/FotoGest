package com.fotogest.controller;

import com.fotogest.dto.*;
import com.fotogest.service.AlbumPublicoService;
import com.fotogest.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/album")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;
    private final AlbumPublicoService albumPublicoService;

    @PostMapping("/gerar/{ensaioId}")
    public ResponseEntity<AlbumResponseDTO> criarAlbum(@PathVariable UUID ensaioId) {
        return ResponseEntity.ok(albumService.gerarAlbumCompleto(ensaioId));
    }

    @GetMapping("/ensaio/{ensaioId}")
    public ResponseEntity<AlbumAdminResponseDTO> buscarAlbumPorEnsaio(@PathVariable UUID ensaioId) {
        return ResponseEntity.ok(albumService.buscarAlbumPorEnsaio(ensaioId));
    }

    @PatchMapping("/reabrir/{ensaioId}")
    public ResponseEntity<AlbumAdminResponseDTO> reabrirAlbum(@PathVariable UUID ensaioId) {
        return ResponseEntity.ok(albumService.reabrirAlbum(ensaioId));
    }

    @PostMapping("/{token}/acessar")
    public ResponseEntity<List<FotoPublicaResponse>> acessarAlbum(
            @PathVariable String token,
            @RequestBody AlbumAcessoRequest request) {
        return ResponseEntity.ok(
                albumPublicoService.acessarAlbum(token, request.getSenha()));
    }

    @GetMapping("/{token}")
    public ResponseEntity<AlbumPublicoResponse> dadosPublicos(@PathVariable String token) {
        return ResponseEntity.ok(
                albumPublicoService.dadosPublicos(token));
    }

    @PostMapping("/{token}/selecao")
    public ResponseEntity<SelecaoResponse> selecionar(
            @PathVariable String token,
            @RequestBody SelecaoRequest request) {
        return ResponseEntity.ok(
                albumPublicoService.selecionarFotos(
                        token,
                        request.getFotosIds(),
                        request.getObservacoesPorFoto()));
    }

    @GetMapping("/{token}/selecao")
    public ResponseEntity<SelecaoResponse> buscar(@PathVariable String token) {
        return ResponseEntity.ok(
                albumPublicoService.buscarSelecao(token));
    }
}
