package com.olhari.controller;

import com.olhari.dto.FotoResponse;
import com.olhari.service.FotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fotos")
@RequiredArgsConstructor
public class FotoController {

    private final FotoService fotoService;

    @PostMapping(
            value = "/upload/{ensaioId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<FotoResponse>> upload(
            @PathVariable UUID ensaioId,
            @RequestParam(value = "imagens", required = false) List<MultipartFile> imagens,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem
    ) throws IOException {

        return ResponseEntity.ok(
                fotoService.salvarFotos(imagens, imagem, ensaioId)
        );
    }

    @GetMapping("/ensaio/{ensaioId}")
    public ResponseEntity<List<FotoResponse>> listarPorEnsaio(@PathVariable UUID ensaioId) {
        return ResponseEntity.ok(fotoService.listarPorEnsaio(ensaioId));
    }

    @PatchMapping("/{fotoId}/capa")
    public ResponseEntity<FotoResponse> definirCapa(@PathVariable UUID fotoId) {
        return ResponseEntity.ok(fotoService.definirComoCapa(fotoId));
    }

    @PatchMapping("/ensaio/{ensaioId}/ordenar")
    public ResponseEntity<List<FotoResponse>> reordenarFotos(
            @PathVariable UUID ensaioId,
            @RequestBody List<UUID> fotosIds
    ) {
        return ResponseEntity.ok(fotoService.reordenarFotos(ensaioId, fotosIds));
    }

    @DeleteMapping("/{fotoId}")
    public ResponseEntity<Void> removerFoto(@PathVariable UUID fotoId) throws IOException {
        fotoService.removerFoto(fotoId);
        return ResponseEntity.noContent().build();
    }
}