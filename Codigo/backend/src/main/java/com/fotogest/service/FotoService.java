package com.fotogest.service;

import com.fotogest.dto.FotoResponse;
import com.fotogest.model.Album;
import com.fotogest.model.Ensaio;
import com.fotogest.model.Foto;
import com.fotogest.repository.AlbumRepository;
import com.fotogest.repository.EnsaioRepository;
import com.fotogest.repository.FotoRepository;
import com.fotogest.repository.SelecaoFotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FotoService {

    private static final int MAX_UPLOAD_CONCURRENCY = 4;

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

        arquivos.forEach(this::validarImagem);

        List<UploadFotoResult> uploads = enviarFotosParaCloudinary(arquivos, ensaioId);
        List<Foto> fotosParaSalvar = new ArrayList<>();

        for (UploadFotoResult upload : uploads) {
            String urlWatermark = marcaDaguaService.gerarUrlComMarcaDagua(upload.urlOriginal());
            boolean deveSerCapa = !jaTemCapa && upload.index() == 0;

            Foto foto = Foto.builder()
                    .ensaio(ensaio)
                    .cloudinaryId(upload.publicId())
                    .nomeOriginal(upload.nomeOriginal())
                    .urlOriginal(upload.urlOriginal())
                    .urlWatermark(urlWatermark)
                    .ehCapa(deveSerCapa)
                    .ordem(proximaOrdem + upload.index())
                    .build();

            fotosParaSalvar.add(foto);

            if (deveSerCapa) {
                jaTemCapa = true;
            }
        }

        List<Foto> fotosSalvas = fotoRepository.saveAll(fotosParaSalvar);

        return fotosSalvas
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private List<UploadFotoResult> enviarFotosParaCloudinary(
            List<MultipartFile> arquivos,
            UUID ensaioId
    ) {
        int concorrencia = Math.min(MAX_UPLOAD_CONCURRENCY, arquivos.size());
        ExecutorService executor = Executors.newFixedThreadPool(concorrencia);
        List<UploadFotoResult> uploadsConcluidos = new ArrayList<>();

        try {
            List<Callable<UploadFotoResult>> tarefas = new ArrayList<>();

            for (int i = 0; i < arquivos.size(); i++) {
                final int index = i;
                MultipartFile arquivo = arquivos.get(i);

                tarefas.add(() -> {
                    Map<String, Object> uploadResult = cloudinaryService.upload(arquivo, ensaioId);
                    String urlOriginal = extrairString(uploadResult, "secure_url");

                    if (urlOriginal == null) {
                        urlOriginal = extrairString(uploadResult, "url");
                    }

                    String publicId = extrairString(uploadResult, "public_id");

                    if (urlOriginal == null && publicId != null) {
                        urlOriginal = cloudinaryService.gerarUrlImagem(publicId);
                    }

                    if (urlOriginal == null || publicId == null) {
                        throw new ResponseStatusException(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "Upload concluido, mas o Cloudinary nao retornou a URL da imagem"
                        );
                    }

                    return new UploadFotoResult(
                            index,
                            arquivo.getOriginalFilename(),
                            urlOriginal,
                            publicId
                    );
                });
            }

            List<Future<UploadFotoResult>> resultados = executor.invokeAll(tarefas);
            RuntimeException erroUpload = null;

            for (Future<UploadFotoResult> resultado : resultados) {
                try {
                    uploadsConcluidos.add(resultado.get());
                } catch (ExecutionException e) {
                    erroUpload = new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Não foi possível enviar todas as fotos. Tente novamente."
                    );
                }
            }

            if (erroUpload != null) {
                limparUploadsConcluidos(uploadsConcluidos);
                throw erroUpload;
            }

            return uploadsConcluidos.stream()
                    .sorted(Comparator.comparingInt(UploadFotoResult::index))
                    .toList();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            limparUploadsConcluidos(uploadsConcluidos);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Envio de fotos interrompido. Tente novamente."
            );
        } finally {
            executor.shutdownNow();
        }
    }

    private void limparUploadsConcluidos(List<UploadFotoResult> uploads) {
        for (UploadFotoResult upload : uploads) {
            try {
                cloudinaryService.deletar(upload.publicId());
            } catch (IOException ignored) {
                // Se a limpeza falhar, a operação principal ainda deve retornar o erro de upload.
            }
        }
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

private String extrairString(Map<String, Object> origem, String chave) {
    Object valor = origem.get(chave);

    if (valor == null) {
        return null;
    }

    String texto = String.valueOf(valor).trim();

    if (texto.isEmpty() || "null".equalsIgnoreCase(texto)) {
        return null;
    }

    return texto;
}

   private FotoResponse toResponse(Foto foto) {
    String urlOriginal = normalizarUrl(foto.getUrlOriginal());

    if (urlOriginal == null) {
        urlOriginal = cloudinaryService.gerarUrlImagem(foto.getCloudinaryId());
    }

    String urlWatermark = normalizarUrl(foto.getUrlWatermark());

    if (urlWatermark == null) {
        urlWatermark = urlOriginal;
    }

    return FotoResponse.builder()
            .id(foto.getId())
            .ensaioId(foto.getEnsaio().getId())
            .cloudinaryId(foto.getCloudinaryId())
            .nomeOriginal(foto.getNomeOriginal())
            .urlWatermark(urlWatermark)
            .urlOriginal(urlOriginal)
            .ordem(foto.getOrdem())
            .ehCapa(foto.getEhCapa())
            .enviadaEm(foto.getEnviadaEm())
            .build();
}

private String normalizarUrl(String valor) {
    if (valor == null) {
        return null;
    }

    String texto = valor.trim();

    if (texto.isEmpty() || "null".equalsIgnoreCase(texto)) {
        return null;
    }

    return texto;
}

private record UploadFotoResult(
        int index,
        String nomeOriginal,
        String urlOriginal,
        String publicId
) {
}
}
