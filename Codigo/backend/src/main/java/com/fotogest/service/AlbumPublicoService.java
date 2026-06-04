package com.fotogest.service;

import com.fotogest.dto.AlbumPublicoResponse;
import com.fotogest.dto.FotoPublicaResponse;
import com.fotogest.dto.FotoResponse;
import com.fotogest.dto.SelecaoResponse;
import com.fotogest.enums.TipoEnsaio;
import com.fotogest.model.Album;
import com.fotogest.model.Ensaio;
import com.fotogest.model.Foto;
import com.fotogest.model.SelecaoFoto;
import com.fotogest.repository.AlbumRepository;
import com.fotogest.repository.FotoRepository;
import com.fotogest.repository.FotografaRepository;
import com.fotogest.repository.PreferenciasSistemaRepository;
import com.fotogest.repository.SelecaoFotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumPublicoService {

        private final AlbumRepository albumRepository;
        private final FotoRepository fotoRepository;
        private final SelecaoFotoRepository selecaoRepository;
        private final FotografaRepository fotografaRepository;
        private final PasswordEncoder passwordEncoder;
        private final PreferenciasSistemaRepository preferenciasSistemaRepository;
        private final EmailService emailService;

        // 🔐 ACESSAR ÁLBUM (CLIENTE)
        @Transactional
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

                album.setViews(album.getViews() == null ? 1 : album.getViews() + 1);

                return fotoRepository.findByEnsaioId(album.getEnsaio().getId())
                                .stream()
                                .map(foto -> new FotoPublicaResponse(
                                                foto.getId(),
                                                foto.getUrlWatermark(),
                                                foto.getEhCapa()))
                                .toList();
        }

        // SELECIONAR FOTOS
        @Transactional
        public SelecaoResponse selecionarFotos(
                        String token,
                        List<UUID> fotosIds,
                        Map<UUID, String> observacoesPorFoto) {

                Album album = albumRepository.findByTokenUrl(token)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Álbum não encontrado"));

                if (!Boolean.TRUE.equals(album.getAcessoLiberado())) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso não autorizado ao álbum");
                }

                if (selecaoRepository.existsByAlbumId(album.getId())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seleção já enviada");
                }

                List<UUID> idsRecebidos = fotosIds == null ? List.of() : fotosIds;
                Map<UUID, String> observacoesRecebidas = observacoesPorFoto == null
                                ? Map.of()
                                : observacoesPorFoto;

                List<Foto> fotos = fotoRepository.findAllById(idsRecebidos);

                if (fotos.size() != idsRecebidos.size()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecao contem fotos invalidas");
                }

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
                                                .observacao(normalizarObservacao(
                                                                observacoesRecebidas.get(foto.getId())))
                                                .build())
                                .toList();

                selecaoRepository.saveAll(selecoes);

                int total = idsRecebidos.size();

                int limite = album.getEnsaio().getQtdFotosPacote();

                int excedente = Math.max(0, total - limite);

                BigDecimal valorExcedente = BigDecimal.ZERO;

                if (Boolean.TRUE.equals(album.getEnsaio().getCobrarFotoExtra())
                                && album.getEnsaio().getValorFotoExtra() != null) {

                        valorExcedente = album.getEnsaio()
                                        .getValorFotoExtra()
                                        .multiply(BigDecimal.valueOf(excedente));
                }

                Map<UUID, String> observacoesNormalizadas = selecoes.stream()
                                .filter(selecao -> selecao.getObservacao() != null)
                                .collect(Collectors.toMap(
                                                selecao -> selecao.getFoto().getId(),
                                                SelecaoFoto::getObservacao));

                SelecaoResponse response = new SelecaoResponse(
                                idsRecebidos,
                                total,
                                limite,
                                excedente,
                                valorExcedente.doubleValue(),
                                observacoesNormalizadas);

                BigDecimal valorExcedenteFinal = valorExcedente;

                executarAposCommit(() -> emailService.enviarNotificacoesSelecaoAsync(
                                album.getId(),
                                total,
                                limite,
                                excedente,
                                valorExcedenteFinal));

                return response;
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

                Map<UUID, String> observacoesPorFoto = selecoes.stream()
                                .filter(selecao -> selecao.getObservacao() != null
                                                && !selecao.getObservacao().isBlank())
                                .collect(Collectors.toMap(
                                                selecao -> selecao.getFoto().getId(),
                                                SelecaoFoto::getObservacao));

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
                                valorExcedente.doubleValue(),
                                observacoesPorFoto);
        }

        // 🌐 DADOS PÚBLICOS
        private String normalizarObservacao(String observacao) {
                if (observacao == null) {
                        return null;
                }

                String valor = observacao.trim();

                if (valor.isBlank()) {
                        return null;
                }

                if (valor.length() > 500) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Observacao deve ter no maximo 500 caracteres");
                }

                return valor;
        }

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
                                buscarNomeFotografa(),
                                resolverTipoExibicao(album.getEnsaio()),
                                album.getEnsaio().getQtdFotosPacote(),
                                album.getEnsaio().getDataEnsaio(),
                                album.getEnsaio().getLocal(),
                                album.getEnsaio().getCobrarFotoExtra(),
                                album.getEnsaio().getValorFotoExtra(),
                                buscarCapaAlbumPadrao(),
                                album.getExpiraEm());
        }

        private String buscarNomeFotografa() {
                return fotografaRepository.findAll()
                                .stream()
                                .findFirst()
                                .map(fotografa -> fotografa.getNome())
                                .filter(nome -> nome != null && !nome.isBlank())
                                .orElse(null);
        }

        private String resolverTipoExibicao(Ensaio ensaio) {
                if (ensaio == null || ensaio.getTipo() == null) {
                        return null;
                }

                if (ensaio.getTipo() == TipoEnsaio.OUTRO
                                && ensaio.getTipoPersonalizado() != null
                                && !ensaio.getTipoPersonalizado().isBlank()) {
                        return ensaio.getTipoPersonalizado().trim();
                }

                return ensaio.getTipo().getDescricao();
        }

        private String buscarCapaAlbumPadrao() {
                return preferenciasSistemaRepository.findAll()
                                .stream()
                                .findFirst()
                                .map(preferencias -> preferencias.getCapaAlbumPadraoUrl())
                                .orElse(null);
        }

        private void executarAposCommit(Runnable action) {
                if (TransactionSynchronizationManager.isSynchronizationActive()) {
                        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                                @Override
                                public void afterCommit() {
                                        action.run();
                                }
                        });
                        return;
                }

                action.run();
        }

}
