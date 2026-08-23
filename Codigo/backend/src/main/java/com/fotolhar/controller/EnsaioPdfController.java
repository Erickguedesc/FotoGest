package com.fotolhar.controller;

import com.fotolhar.service.EnsaioPdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/ensaios")
public class EnsaioPdfController {

    private final EnsaioPdfService ensaioPdfService;

    public EnsaioPdfController(EnsaioPdfService ensaioPdfService) {
        this.ensaioPdfService = ensaioPdfService;
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportarPdf(@PathVariable UUID id) {
        byte[] pdf = ensaioPdfService.gerarPdf(id);

        String filename = "ensaio-" + id + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\""
                )
                .body(pdf);
    }
}