package com.olhari.service;

import com.olhari.dto.FotoResponse;
import com.olhari.model.Ensaio;
import com.olhari.model.Foto;
import com.olhari.repository.FotoRepository;
import com.olhari.repository.EnsaioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FotoService {

    private final CloudinaryService cloudinaryService;
    private final FotoRepository fotoRepository;
    private final EnsaioRepository ensaioRepository;
public FotoResponse salvarFoto(MultipartFile arquivo, UUID ensaioId) throws IOException {
    Ensaio ensaio = ensaioRepository.findById(ensaioId)
            .orElseThrow(() -> new RuntimeException("Ensaio não encontrado"));

    Map<String, Object> uploadResult = cloudinaryService.upload(arquivo);
    String url = (String) uploadResult.get("secure_url");
    String publicId = (String) uploadResult.get("public_id");

    Foto foto = Foto.builder()
            .ensaio(ensaio)
            .cloudinaryId(publicId)
            .urlOriginal(url)
            .urlWatermark(url)
            .ehCapa(false)
            .ordem(0)
            .build();

    return toResponse(fotoRepository.save(foto));
}

public List<FotoResponse> listarPorEnsaio(UUID ensaioId) {
    return fotoRepository.findByEnsaioId(ensaioId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

private FotoResponse toResponse(Foto foto) {
    return FotoResponse.builder()
            .id(foto.getId())
            .ensaioId(foto.getEnsaio().getId())
            .cloudinaryId(foto.getCloudinaryId())
            .urlWatermark(foto.getUrlWatermark())
            .urlOriginal(foto.getUrlOriginal())
            .ordem(foto.getOrdem())
            .ehCapa(foto.getEhCapa())
            .enviadaEm(foto.getEnviadaEm())
            .build();
}

}