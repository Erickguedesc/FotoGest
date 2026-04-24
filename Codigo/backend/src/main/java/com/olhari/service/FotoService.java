package com.olhari.service;

import com.olhari.model.Ensaio;
import com.olhari.model.Foto;
import com.olhari.repository.FotoRepository;
import com.olhari.repository.EnsaioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Builder // <-- ADICIONE ISSO
@AllArgsConstructor // <-- O BUILDER PRECISA DISSO
@NoArgsConstructor  // <-- O HIBERNATE PRECISA DISSO

@Service
public class FotoService {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private FotoRepository fotoRepository;

    @Autowired
    private EnsaioRepository ensaioRepository;

    public Foto salvarFoto(MultipartFile arquivo, UUID ensaioId) throws IOException {
        // 1. Busca o ensaio que você acabou de criar no banco
        Ensaio ensaio = ensaioRepository.findById(ensaioId)
                .orElseThrow(() -> new RuntimeException("Ensaio não encontrado!"));

        // 2. Sobe para o Cloudinary
        Map uploadResult = cloudinaryService.upload(arquivo);
        String url = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        // 3. Monta o objeto Foto para o Postgres
        Foto foto = Foto.builder()
                .ensaio(ensaio)
                .cloudinaryId(publicId)
                .urlOriginal(url)
                .urlWatermark(url) // Por enquanto salvamos a mesma, depois faremos a marca d'água
                .ehCapa(false)
                .ordem(0)
                .build();

        // 4. Salva no banco e retorna para o Controller
        return fotoRepository.save(foto);
    }
}