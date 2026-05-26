package com.olhari.controller;

import com.olhari.service.HomepageConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/homepage-config")
@RequiredArgsConstructor
public class HomepageConfigController {

    private final HomepageConfigService service;

    @GetMapping
    public Map<String, Object> buscar() {
        return service.buscar();
    }

    @PutMapping
    public Map<String, Object> atualizar(@RequestBody Map<String, Object> dados) {
        return service.atualizar(dados);
    }

    @PostMapping(value = "/imagem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadImagem(@RequestParam("arquivo") MultipartFile arquivo) {
        return service.uploadImagem(arquivo);
    }
}
