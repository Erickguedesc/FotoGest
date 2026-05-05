package com.olhari.service;

import com.olhari.dto.AlbumPublicoResponse;
import com.olhari.dto.FotoPublicaResponse;
import com.olhari.dto.FotoResponse;
import com.olhari.dto.SelecaoResponse;
import com.olhari.model.Album;
import com.olhari.model.Foto;
import com.olhari.model.SelecaoFoto;
import com.olhari.repository.AlbumRepository;
import com.olhari.repository.FotoRepository;
import com.olhari.repository.SelecaoFotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumPublicoService {

        private final AlbumRepository albumRepository;
        private final FotoRepository fotoRepository;
        private final SelecaoFotoRepository selecaoRepository;
        private final PasswordEncoder passwordEncoder;

        // 🔐 ACESSAR ÁLBUM (CLIENTE)
        public List<FotoPublicaResponse> acessarAlbum(String token, String senha) {

                Album album = albumRepository.findByTokenUrl(token)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Álbum não encontrado"));

                if (!album.getAtivo()) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Álbum desativado");
                }

                if (album.getExpiraEm() != null && album.getExpiraEm().isBefore(OffsetDateTime.now())) {
                        throw new ResponseStatusException(HttpStatus.GONE, "Álbum expirado");
                }

                if (!passwordEncoder.matches(senha, album.getSenhaHash())) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta");
                }

                return fotoRepository.findByEnsaioId(album.getEnsaio().getId())
                                .stream()
                                .map(foto -> new FotoPublicaResponse(
                                                foto.getId(),
                                                foto.getUrlWatermark()))
                                .toList();
        }

        // SELECIONAR FOTOS
        public SelecaoResponse selecionarFotos(String token, List<UUID> fotosIds) {

                Album album = albumRepository.findByTokenUrl(token)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Álbum não encontrado"));

                if (!Boolean.TRUE.equals(album.getAcessoLiberado())) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso não autorizado ao álbum");
                }

                if (selecaoRepository.existsByAlbumId(album.getId())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seleção já enviada");
                }

                List<Foto> fotos = fotoRepository.findAllById(fotosIds);

                // valida se todas as fotos pertencem ao ensaio
                UUID ensaioId = album.getEnsaio().getId();

                boolean invalida = fotos.stream()
                                .anyMatch(f -> !f.getEnsaio().getId().equals(ensaioId));

                if (invalida) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Foto não pertence ao ensaio");
                }

                List<SelecaoFoto> selecoes = fotos.stream()
                                .map(foto -> SelecaoFoto.builder()
                                                .album(album)
                                                .foto(foto)
                                                .build())
                                .toList();

                selecaoRepository.saveAll(selecoes);

                int total = fotosIds.size();

                int limite = album.getEnsaio().getQtdFotosPacote();

                int excedente = Math.max(0, total - limite);

                BigDecimal valorExcedente = BigDecimal.ZERO;

                if (Boolean.TRUE.equals(album.getEnsaio().getCobrarFotoExtra())
                                && album.getEnsaio().getValorFotoExtra() != null) {

                        valorExcedente = album.getEnsaio()
                                        .getValorFotoExtra()
                                        .multiply(BigDecimal.valueOf(excedente));
                }

                return new SelecaoResponse(
                                fotosIds,
                                total,
                                limite,
                                excedente,
                                valorExcedente.doubleValue());
        }

        // 👩‍💼 CONSULTA SELEÇÃO
        public SelecaoResponse buscarSelecao(String token) {

                Album album = albumRepository.findByTokenUrl(token)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Álbum não encontrado"));

                List<SelecaoFoto> selecoes = selecaoRepository.findByAlbumId(album.getId());

                List<UUID> ids = selecoes.stream()
                                .map(s -> s.getFoto().getId())
                                .collect(Collectors.toList());

                int total = ids.size();
                int limite = album.getEnsaio().getQtdFotosPacote();

                int excedente = Math.max(0, total - limite);

                BigDecimal valorExcedente = BigDecimal.ZERO;

                if (Boolean.TRUE.equals(album.getEnsaio().getCobrarFotoExtra())
                                && album.getEnsaio().getValorFotoExtra() != null) {

                        valorExcedente = album.getEnsaio()
                                        .getValorFotoExtra()
                                        .multiply(BigDecimal.valueOf(excedente));
                }

                return new SelecaoResponse(
                                ids,
                                total,
                                limite,
                                excedente,
                                valorExcedente.doubleValue());
        }

  // 🌐 DADOS PÚBLICOS
public AlbumPublicoResponse dadosPublicos(String token) {

    Album album = albumRepository.findByTokenUrl(token)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Álbum não encontrado"));

                    // 🛑 ADICIONE ESTA TRAVA AQUI:
    if (!Boolean.TRUE.equals(album.getAtivo())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Álbum desativado");
    }

    return new AlbumPublicoResponse(
            album.getEnsaio().getCliente().getNome(),
            album.getEnsaio().getTipo().name(),
            album.getEnsaio().getQtdFotosPacote()); // ✅ Agora pega os 40 do pacote contratado
}
}