package com.olhari.controller;

import com.olhari.model.Foto;
import com.olhari.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import com.olhari.service.FotoService;
import java.util.UUID;
@RestController
@RequestMapping("/api/fotos")
public class FotoController {

    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private FotoService fotoService; // <--- Garanta que esta linha existe!
  @PostMapping("/upload-teste")
public ResponseEntity<Map<String, Object>> uploadTeste(@RequestParam("imagem") MultipartFile arquivo) throws IOException {
    Map<String, Object> resultado = cloudinaryService.upload(arquivo);
    return ResponseEntity.ok(resultado);
}


@PostMapping("/upload/{ensaioId}")
public ResponseEntity<Foto> upload(
    @PathVariable UUID ensaioId, 
    @RequestParam("imagem") MultipartFile arquivo) throws IOException {
    
    // Aqui chamaremos o service que faz a mágica completa
    Foto fotoSalva = fotoService.salvarFoto(arquivo, ensaioId);
    return ResponseEntity.ok(fotoSalva);
}


}