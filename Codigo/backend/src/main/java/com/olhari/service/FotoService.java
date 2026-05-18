package com.olhari.service;

import com.olhari.dto.FotoResponse;
import com.olhari.model.Album;
import com.olhari.model.Ensaio;
import com.olhari.model.Foto;
import com.olhari.repository.AlbumRepository;
import com.olhari.repository.EnsaioRepository;
import com.olhari.repository.FotoRepository;
import com.olhari.repository.SelecaoFotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FotoService {

    private final CloudinaryService cloudinaryService;
    private final FotoRepository fotoRepository;
    private final EnsaioRepository ensaioRepository;
    private final SelecaoFotoRepository selecaoFotoRepository;
    private final AlbumRepository albumRepository;
    private final MarcaDaguaService marcaDaguaService;

    @Transactional
    public List<FotoResponse> salvarFotos(
            List<MultipartFile> imagens,
            MultipartFile imagem,
            UUID ensaioId
    ) throws IOException {

        bloquearSeAlbumPublicado(ensaioId);

        List<MultipartFile> arquivos = normalizarArquivos(imagens, imagem);

        if (arquivos.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nenhuma imagem foi enviada"
            );
        }

        Ensaio ensaio = ensaioRepository.findById(ensaioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ensaio não encontrado"
                ));

        int proximaOrdem = fotoRepository.countByEnsaioId(ensaioId);
        boolean jaTemCapa = fotoRepository.existsByEnsaioIdAndEhCapaTrue(ensaioId);

        List<Foto> fotosSalvas = new ArrayList<>();

 for (int i = 0; i < arquivos.size(); i++) {
    MultipartFile arquivo = arquivos.get(i);

    String nomeOriginal = arquivo.getOriginalFilename();

    validarImagem(arquivo);

    Map<String, Object> uploadResult = cloudinaryService.upload(arquivo, ensaioId);

 String urlOriginal = String.valueOf(uploadResult.get("secure_url"));
String urlWatermark = marcaDaguaService.gerarUrlComMarcaDagua(urlOriginal);
String publicId = String.valueOf(uploadResult.get("public_id"));

    boolean deveSerCapa = !jaTemCapa && i == 0;

    Foto foto = Foto.builder()
            .ensaio(ensaio)
            .cloudinaryId(publicId)
            .nomeOriginal(nomeOriginal)
            .urlOriginal(urlOriginal)
            .urlWatermark(urlWatermark)
            .ehCapa(deveSerCapa)
            .ordem(proximaOrdem + i)
            .build();

    fotosSalvas.add(fotoRepository.save(foto));

    if (deveSerCapa) {
        jaTemCapa = true;
    }
}

        return fotosSalvas
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FotoResponse> listarPorEnsaio(UUID ensaioId) {
        ensaioRepository.findById(ensaioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ensaio não encontrado"
                ));

        return fotoRepository.findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(ensaioId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FotoResponse definirComoCapa(UUID fotoId) {
        Foto fotoCapa = fotoRepository.findById(fotoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Foto não encontrada"
                ));

        UUID ensaioId = fotoCapa.getEnsaio().getId();

        bloquearSeAlbumPublicado(ensaioId);

        List<Foto> fotosDoEnsaio = fotoRepository.findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(ensaioId);

        for (Foto foto : fotosDoEnsaio) {
            foto.setEhCapa(false);
        }

        fotoCapa.setEhCapa(true);

        fotoRepository.saveAll(fotosDoEnsaio);

        return toResponse(fotoCapa);
    }

    @Transactional
    public List<FotoResponse> reordenarFotos(UUID ensaioId, List<UUID> fotosIds) {
        bloquearSeAlbumPublicado(ensaioId);

        if (fotosIds == null || fotosIds.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A lista de fotos para ordenação não pode estar vazia"
            );
        }

        List<Foto> fotosDoEnsaio = fotoRepository.findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(ensaioId);

        Map<UUID, Foto> fotosPorId = fotosDoEnsaio
                .stream()
                .collect(Collectors.toMap(Foto::getId, foto -> foto));

        for (int i = 0; i < fotosIds.size(); i++) {
            UUID fotoId = fotosIds.get(i);
            Foto foto = fotosPorId.get(fotoId);

            if (foto == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A foto " + fotoId + " não pertence a este ensaio"
                );
            }

            foto.setOrdem(i);
        }

        fotoRepository.saveAll(fotosDoEnsaio);

        return fotoRepository.findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(ensaioId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removerFoto(UUID fotoId) throws IOException {
        Foto foto = fotoRepository.findById(fotoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Foto não encontrada"
                ));

        UUID ensaioId = foto.getEnsaio().getId();

        bloquearSeAlbumPublicado(ensaioId);

        boolean eraCapa = Boolean.TRUE.equals(foto.getEhCapa());

        selecaoFotoRepository.deleteByFotoId(fotoId);

        cloudinaryService.deletar(foto.getCloudinaryId());

        fotoRepository.delete(foto);

        if (eraCapa) {
            List<Foto> fotosRestantes = fotoRepository.findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(ensaioId);

            if (!fotosRestantes.isEmpty()) {
                Foto novaCapa = fotosRestantes.get(0);
                novaCapa.setEhCapa(true);
                fotoRepository.save(novaCapa);
            }
        }
    }

    private void bloquearSeAlbumPublicado(UUID ensaioId) {
        Optional<Album> albumOptional = albumRepository.findByEnsaioId(ensaioId);

        if (albumOptional.isEmpty()) {
            return;
        }

        Album album = albumOptional.get();

        boolean publicado =
                Boolean.TRUE.equals(album.getAtivo()) &&
                Boolean.TRUE.equals(album.getAcessoLiberado());

        if (publicado) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O álbum já foi publicado. Não é possível alterar fotos deste ensaio."
            );
        }
    }

    private List<MultipartFile> normalizarArquivos(
            List<MultipartFile> imagens,
            MultipartFile imagem
    ) {
        List<MultipartFile> arquivos = new ArrayList<>();

        if (imagens != null && !imagens.isEmpty()) {
            arquivos.addAll(imagens);
        }

        if (imagem != null && !imagem.isEmpty()) {
            arquivos.add(imagem);
        }

        return arquivos;
    }

    private void validarImagem(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Arquivo de imagem inválido"
            );
        }

        String contentType = arquivo.getContentType();

        boolean tipoValido =
                "image/jpeg".equals(contentType) ||
                "image/png".equals(contentType) ||
                "image/webp".equals(contentType);

        if (!tipoValido) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Formato inválido. Envie apenas JPG, PNG ou WEBP"
            );
        }
    }

   private FotoResponse toResponse(Foto foto) {
    return FotoResponse.builder()
            .id(foto.getId())
            .ensaioId(foto.getEnsaio().getId())
            .cloudinaryId(foto.getCloudinaryId())
            .nomeOriginal(foto.getNomeOriginal())
            .urlWatermark(foto.getUrlWatermark())
            .urlOriginal(foto.getUrlOriginal())
            .ordem(foto.getOrdem())
            .ehCapa(foto.getEhCapa())
            .enviadaEm(foto.getEnviadaEm())
            .build();
}
}