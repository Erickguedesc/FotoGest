package com.olhari.controller;

import com.olhari.dto.AcessoAlbumRequest;
import com.olhari.dto.AcessoAlbumResponse;
import com.olhari.dto.AlbumResponseDTO;
import com.olhari.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/album")
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

    // 🔎 Validação do token
    @GetMapping("/{token}")
    public ResponseEntity<?> validarAlbum(@PathVariable String token) {
        albumService.validarToken(token);
        return ResponseEntity.ok().build();
    }

    // 🔐 Acesso com senha
    @PostMapping("/{token}/access")
    public ResponseEntity<AcessoAlbumResponse> acessarAlbum(
            @PathVariable String token,
            @RequestBody AcessoAlbumRequest request
    ) {
        albumService.validarAcesso(token, request.senha());

        return ResponseEntity.ok(
                new AcessoAlbumResponse(true, token)
        );
    }
}


