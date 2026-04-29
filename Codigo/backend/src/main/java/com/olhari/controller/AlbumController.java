package com.olhari.controller;

import com.olhari.dto.AlbumResponseDTO;
import com.olhari.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/albuns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite que seu React acesse sem erro de CORS
public class AlbumController {

    private final AlbumService albumService;

    @PostMapping("/gerar/{ensaioId}")
    public ResponseEntity<AlbumResponseDTO> criarAlbum(@PathVariable UUID ensaioId) {
        // Chama o serviço que gera link e senha automática
        AlbumResponseDTO response = albumService.gerarAlbumCompleto(ensaioId);
        return ResponseEntity.ok(response);
    }
}


