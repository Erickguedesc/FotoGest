package com.olhari.service;

import com.olhari.dto.AlbumResponseDTO;
import com.olhari.model.Album;
import com.olhari.model.Ensaio;
import com.olhari.repository.AlbumRepository;
import com.olhari.repository.EnsaioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final EnsaioRepository ensaioRepository;
    private final PasswordEncoder passwordEncoder;

    public AlbumResponseDTO gerarAlbumCompleto(UUID ensaioId) {
        // 1. Busca o ensaio
        Ensaio ensaio = ensaioRepository.findById(ensaioId)
                .orElseThrow(() -> new RuntimeException("Ensaio não encontrado"));

        // 2. Gera Senha e Token aleatórios
        String senhaLimpa = gerarSenhaAleatoria(6);
        String token = UUID.randomUUID().toString().substring(0, 8);

        // 3. Cria o objeto Album e salva o HASH da senha
       Album album = Album.builder()
        .ensaio(ensaio)
        .tokenUrl(token)
        .senhaHash(passwordEncoder.encode(senhaLimpa))
        .acessoLiberado(true) //
        .build();

        albumRepository.save(album);

        // 4. Retorna o DTO com a senha limpa para a fotógrafa copiar
        String urlCompleta = "https://olhari.com/galeria/" + token;
        return new AlbumResponseDTO(urlCompleta, senhaLimpa);
    }

    private String gerarSenhaAleatoria(int tamanho) {
        String caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem '0', 'O', 'I' para não confundir
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < tamanho; i++) {
            sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return sb.toString();
    }

    public void validarAcesso(String token, String senha) {
        if (senha == null || senha.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Senha é obrigatória"
            );
        }

        Album album = albumRepository.findByTokenUrl(token)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Álbum não encontrado"
                ));

        boolean senhaCorreta = passwordEncoder.matches(senha, album.getSenhaHash());

        if (!senhaCorreta) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Senha incorreta"
            );
        }
    }

    public void validarToken(String token) {
        albumRepository.findByTokenUrl(token)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Álbum não encontrado"
            ));
    }
}