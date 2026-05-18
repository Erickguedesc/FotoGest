package com.olhari.controller;

import com.olhari.dto.*;
import com.olhari.service.ConfiguracoesService;
import com.olhari.service.MarcaDaguaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/configuracoes")
@RequiredArgsConstructor
public class ConfiguracoesController {

    private final ConfiguracoesService configuracoesService;
    private final MarcaDaguaService marcaDaguaService;
    @GetMapping
    public ResponseEntity<ConfiguracoesResponseDTO> buscarConfiguracoes() {
        return ResponseEntity.ok(configuracoesService.buscarConfiguracoes());
    }

    @PutMapping("/fotografa")
    public ResponseEntity<FotografaConfigDTO> atualizarFotografa(
            @RequestBody @Valid FotografaUpdateRequest request
    ) {
        return ResponseEntity.ok(configuracoesService.atualizarFotografa(request));
    }
    @PatchMapping(
        value = "/fotografa/foto",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<FotografaConfigDTO> uploadFotoPerfil(
        @RequestParam("arquivo") MultipartFile arquivo
) {
    return ResponseEntity.ok(configuracoesService.uploadFotoPerfil(arquivo));
}

    @PutMapping("/estudio")
    public ResponseEntity<EstudioConfigDTO> atualizarEstudio(
            @RequestBody EstudioUpdateRequest request
    ) {
        return ResponseEntity.ok(configuracoesService.atualizarEstudio(request));
    }
    @PatchMapping(
        value = "/estudio/logo",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<EstudioConfigDTO> uploadLogoEstudio(
        @RequestParam("arquivo") MultipartFile arquivo
) {
    return ResponseEntity.ok(configuracoesService.uploadLogoEstudio(arquivo));
}

    @PutMapping("/preferencias")
    public ResponseEntity<PreferenciasConfigDTO> atualizarPreferencias(
            @RequestBody PreferenciasUpdateRequest request
    ) {
        return ResponseEntity.ok(configuracoesService.atualizarPreferencias(request));
    }

    @PatchMapping("/senha")
    public ResponseEntity<Void> alterarSenha(
            @RequestBody @Valid AlterarSenhaRequest request
    ) {
        configuracoesService.alterarSenha(request);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/marca-dagua")
public ResponseEntity<MarcaDaguaConfigDTO> buscarMarcaDagua() {
    return ResponseEntity.ok(marcaDaguaService.buscarMarcaDagua());
}

@PutMapping("/marca-dagua")
public ResponseEntity<MarcaDaguaConfigDTO> atualizarMarcaDagua(
        @RequestBody MarcaDaguaUpdateRequest request
) {
    return ResponseEntity.ok(marcaDaguaService.atualizarMarcaDagua(request));
}

@PatchMapping(
        value = "/marca-dagua/imagem",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<MarcaDaguaConfigDTO> uploadImagemMarcaDagua(
        @RequestParam("arquivo") MultipartFile arquivo
) {
    return ResponseEntity.ok(marcaDaguaService.uploadImagemMarcaDagua(arquivo));
}

@DeleteMapping("/marca-dagua/imagem")
public ResponseEntity<MarcaDaguaConfigDTO> removerImagemMarcaDagua() {
    return ResponseEntity.ok(marcaDaguaService.removerImagemMarcaDagua());
}

@PostMapping("/marca-dagua/reprocessar")
public ResponseEntity<MarcaDaguaReprocessarResponse> reprocessarFotosMarcaDagua() {
    return ResponseEntity.ok(marcaDaguaService.reprocessarFotosExistentes());
}



}