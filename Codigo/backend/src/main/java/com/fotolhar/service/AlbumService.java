package com.fotolhar.service;

import com.fotolhar.dto.AlbumAdminResponseDTO;
import com.fotolhar.dto.AlbumResponseDTO;
import com.fotolhar.enums.StatusEnsaio;
import com.fotolhar.model.Album;
import com.fotolhar.model.Ensaio;
import com.fotolhar.model.Usuario;
import com.fotolhar.repository.AlbumRepository;
import com.fotolhar.repository.EnsaioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.fotolhar.model.PreferenciasSistema;
import com.fotolhar.repository.PreferenciasSistemaRepository;
import com.fotolhar.repository.SelecaoFotoRepository;

@Service
@RequiredArgsConstructor
public class AlbumService {

private final AlbumRepository albumRepository;
private final EnsaioRepository ensaioRepository;
private final PreferenciasSistemaRepository preferenciasSistemaRepository;
private final SelecaoFotoRepository selecaoFotoRepository;
private final PasswordEncoder passwordEncoder;
private final EmailService emailService;
private final UsuarioContextService usuarioContextService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Transactional
    public AlbumResponseDTO gerarAlbumCompleto(UUID ensaioId) {
        Usuario usuario = usuarioContextService.getUsuarioLogado();
        Ensaio ensaio = ensaioRepository.findByIdAndClienteUsuarioId(ensaioId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ensaio não encontrado"
                ));

        String senhaLimpa = gerarSenhaAleatoria(6).trim().toUpperCase();

        Album album = albumRepository.findByEnsaioIdAndEnsaioClienteUsuarioId(ensaioId, usuario.getId())
                .orElseGet(() -> Album.builder()
                        .ensaio(ensaio)
                        .tokenUrl(gerarTokenUnico())
                        .build()
                );

        boolean albumExistenteReaberto =
                album.getId() != null &&
                (!Boolean.TRUE.equals(album.getAtivo()) ||
                        !Boolean.TRUE.equals(album.getAcessoLiberado()));

        if (albumExistenteReaberto) {
            selecaoFotoRepository.deleteByAlbumId(album.getId());
        }

        album.setSenhaHash(passwordEncoder.encode(senhaLimpa));
        album.setAcessoLiberado(true);
        album.setAtivo(true);
        album.setPublicadoEm(OffsetDateTime.now());

       int prazoExpiracaoDias = buscarPrazoExpiracaoAlbumDias(ensaio);

      album.setExpiraEm(OffsetDateTime.now().plusDays(prazoExpiracaoDias));

        albumRepository.save(album);
        atualizarStatusParaEmSelecaoSeNecessario(ensaio);

        String urlCompleta = frontendUrl + "/album/" + album.getTokenUrl();

        emailService.enviarAlbumPublicado(ensaio, album, senhaLimpa, urlCompleta);

        return new AlbumResponseDTO(urlCompleta, senhaLimpa);
    }

    @Transactional(readOnly = true)
    public AlbumAdminResponseDTO buscarAlbumPorEnsaio(UUID ensaioId) {
        Usuario usuario = usuarioContextService.getUsuarioLogado();
        Album album = albumRepository.findByEnsaioIdAndEnsaioClienteUsuarioId(ensaioId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Álbum ainda não foi criado para este ensaio"
                ));

        return toAdminResponse(album);
    }

    @Transactional
    public AlbumAdminResponseDTO reabrirAlbum(UUID ensaioId) {
        Usuario usuario = usuarioContextService.getUsuarioLogado();
        Album album = albumRepository.findByEnsaioIdAndEnsaioClienteUsuarioId(ensaioId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Álbum ainda não foi criado para este ensaio"
                ));

        album.setAcessoLiberado(false);
        album.setAtivo(false);

        selecaoFotoRepository.deleteByAlbumId(album.getId());

        albumRepository.save(album);
        atualizarStatusParaEmEdicaoSeNecessario(album.getEnsaio());

        return toAdminResponse(album);
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

        if (!Boolean.TRUE.equals(album.getAtivo()) || !Boolean.TRUE.equals(album.getAcessoLiberado())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Álbum indisponível"
            );
        }

        String senhaTratada = senha.trim().toUpperCase();

        boolean senhaCorreta = passwordEncoder.matches(senhaTratada, album.getSenhaHash());

        if (!senhaCorreta) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Senha incorreta"
            );
        }
    }

    public void validarToken(String token) {
        Album album = albumRepository.findByTokenUrl(token)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Álbum não encontrado"
                ));

        if (!Boolean.TRUE.equals(album.getAtivo()) || !Boolean.TRUE.equals(album.getAcessoLiberado())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Álbum indisponível"
            );
        }
    }

    private AlbumAdminResponseDTO toAdminResponse(Album album) {
        String urlCompleta = frontendUrl + "/album/" + album.getTokenUrl();

        return new AlbumAdminResponseDTO(
                album.getId(),
                album.getEnsaio().getId(),
                album.getTokenUrl(),
                urlCompleta,
                album.getAtivo(),
                album.getAcessoLiberado(),
                album.getPublicadoEm(),
                album.getExpiraEm(),
                album.getViews()
        );
    }

    private String gerarTokenUnico() {
        String token;

        do {
            token = UUID.randomUUID().toString().substring(0, 8);
        } while (albumRepository.existsByTokenUrl(token));

        return token;
    }

    private String gerarSenhaAleatoria(int tamanho) {
        String caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < tamanho; i++) {
            sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }

        return sb.toString();
    }

    private int buscarPrazoExpiracaoAlbumDias(Ensaio ensaio) {
    UUID usuarioId = ensaio.getCliente().getUsuario().getId();

    return preferenciasSistemaRepository.findByUsuarioId(usuarioId)
            .map(PreferenciasSistema::getPrazoExpiracaoAlbumDias)
            .filter(dias -> dias != null && dias > 0)
            .orElse(30);
}

private void atualizarStatusParaEmSelecaoSeNecessario(Ensaio ensaio) {
    StatusEnsaio statusAtual = ensaio.getStatus();

    boolean podeAvancarParaSelecao =
            statusAtual == StatusEnsaio.AGENDADO ||
            statusAtual == StatusEnsaio.REALIZADO ||
            statusAtual == StatusEnsaio.EM_EDICAO;

    if (!podeAvancarParaSelecao) {
        return;
    }

    atualizarStatus(ensaio, StatusEnsaio.EM_SELECAO, (short) 50);
}

private void atualizarStatusParaEmEdicaoSeNecessario(Ensaio ensaio) {
    StatusEnsaio statusAtual = ensaio.getStatus();

    if (statusAtual == StatusEnsaio.EM_EDICAO || statusAtual == StatusEnsaio.CANCELADO) {
        return;
    }

    atualizarStatus(ensaio, StatusEnsaio.EM_EDICAO, (short) 75);
}

private void atualizarStatus(Ensaio ensaio, StatusEnsaio status, short progresso) {
    ensaio.setStatus(status);
    ensaio.setProgresso(progresso);
    ensaioRepository.save(ensaio);
}
}
