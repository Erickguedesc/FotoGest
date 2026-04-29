package com.olhari.controller;

import com.olhari.dto.FotoResponse;
import com.olhari.service.FotoService;
import lombok.RequiredArgsConstructor;
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

 @PostMapping("/upload/{ensaioId}")
public ResponseEntity<FotoResponse> upload(
        @PathVariable UUID ensaioId,
        @RequestParam("imagem") MultipartFile arquivo) throws IOException {
    return ResponseEntity.ok(fotoService.salvarFoto(arquivo, ensaioId));
}

@GetMapping("/ensaio/{ensaioId}")
public ResponseEntity<List<FotoResponse>> listarPorEnsaio(@PathVariable UUID ensaioId) {
    return ResponseEntity.ok(fotoService.listarPorEnsaio(ensaioId));
}
}