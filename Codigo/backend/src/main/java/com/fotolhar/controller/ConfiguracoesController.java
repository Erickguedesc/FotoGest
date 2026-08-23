package com.fotolhar.controller;

import com.fotolhar.dto.*;
import com.fotolhar.service.ConfiguracoesService;
import com.fotolhar.service.MarcaDaguaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
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

    @PostMapping("/onboarding/concluir")
    public ResponseEntity<ConfiguracoesResponseDTO> concluirOnboarding() {
        return ResponseEntity.ok(configuracoesService.concluirOnboarding());
    }

    @PostMapping(value = "/backup/metadados", produces = "application/zip")
    public ResponseEntity<byte[]> gerarBackupMetadados() {
        byte[] arquivo = configuracoesService.gerarBackupMetadadosZip();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=fotolhar-backup.zip")
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(arquivo);
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

    @PutMapping("/email")
    public ResponseEntity<EmailConfigDTO> atualizarEmail(
            @RequestBody EmailConfigUpdateRequest request
    ) {
        return ResponseEntity.ok(configuracoesService.atualizarEmail(request));
    }

    @PostMapping("/email/teste")
    public ResponseEntity<EmailConfigDTO> enviarEmailTeste() {
        return ResponseEntity.ok(configuracoesService.enviarEmailTeste());
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

@PostMapping("/marca-dagua/texto")
public ResponseEntity<MarcaDaguaConfigDTO> gerarMarcaDaguaTexto(
        @RequestBody @Valid MarcaDaguaTextoRequest request
) {
    return ResponseEntity.ok(marcaDaguaService.gerarMarcaDaguaTexto(request));
}

@DeleteMapping("/marca-dagua/imagem")
public ResponseEntity<MarcaDaguaConfigDTO> removerImagemMarcaDagua() {
    return ResponseEntity.ok(marcaDaguaService.removerImagemMarcaDagua());
}

@PostMapping("/marca-dagua/reprocessar")
public ResponseEntity<MarcaDaguaReprocessarResponse> reprocessarFotosMarcaDagua() {
    return ResponseEntity.ok(marcaDaguaService.reprocessarFotosExistentes());
}

@PatchMapping(
        value = "/preferencias/capa-album",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<PreferenciasConfigDTO> uploadCapaAlbumPadrao(
        @RequestParam("arquivo") MultipartFile arquivo
) {
    return ResponseEntity.ok(configuracoesService.uploadCapaAlbumPadrao(arquivo));
}

}
