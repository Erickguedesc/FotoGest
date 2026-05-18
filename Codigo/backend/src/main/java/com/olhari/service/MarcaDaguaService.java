package com.olhari.service;

import com.olhari.dto.MarcaDaguaConfigDTO;
import com.olhari.dto.MarcaDaguaReprocessarResponse;
import com.olhari.dto.MarcaDaguaUpdateRequest;
import com.olhari.enums.MarcaDaguaPosicao;
import com.olhari.enums.MarcaDaguaTamanho;
import com.olhari.model.ConfiguracaoEstudio;
import com.olhari.model.Fotografa;
import com.olhari.model.Foto;
import com.olhari.repository.ConfiguracaoEstudioRepository;
import com.olhari.repository.FotografaRepository;
import com.olhari.repository.FotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MarcaDaguaService {

    private final CloudinaryService cloudinaryService;
    private final FotografaRepository fotografaRepository;
    private final ConfiguracaoEstudioRepository configuracaoEstudioRepository;
    private final FotoRepository fotoRepository;

    @Transactional(readOnly = true)
    public MarcaDaguaConfigDTO buscarMarcaDagua() {
        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

        return toDTO(estudio);
    }

    @Transactional
    public MarcaDaguaConfigDTO atualizarMarcaDagua(MarcaDaguaUpdateRequest request) {
        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

        if (request.getMarcaDaguaAtiva() != null) {
            estudio.setMarcaDaguaAtiva(request.getMarcaDaguaAtiva());
        }

        if (request.getMarcaDaguaPosicao() != null) {
            estudio.setMarcaDaguaPosicao(request.getMarcaDaguaPosicao());
        }

        if (request.getMarcaDaguaTamanho() != null) {
            estudio.setMarcaDaguaTamanho(request.getMarcaDaguaTamanho());
        }

        if (request.getMarcaDaguaOpacidade() != null) {
            int opacidade = Math.max(10, Math.min(100, request.getMarcaDaguaOpacidade()));
            estudio.setMarcaDaguaOpacidade(opacidade);
        }

        if (request.getMarcaDaguaMargem() != null) {
            int margem = Math.max(0, Math.min(100, request.getMarcaDaguaMargem()));
            estudio.setMarcaDaguaMargem(margem);
        }

        configuracaoEstudioRepository.save(estudio);

        return toDTO(estudio);
    }

    @Transactional
    public MarcaDaguaConfigDTO uploadImagemMarcaDagua(MultipartFile arquivo) {
        validarImagem(arquivo);

        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

        try {
            if (estudio.getMarcaDaguaPublicId() != null && !estudio.getMarcaDaguaPublicId().isBlank()) {
                cloudinaryService.deletar(estudio.getMarcaDaguaPublicId());
            }

            Map<String, Object> uploadResult =
                    cloudinaryService.uploadConfiguracao(arquivo, "marca-dagua");

            String url = String.valueOf(uploadResult.get("secure_url"));
            String publicId = String.valueOf(uploadResult.get("public_id"));

            estudio.setMarcaDaguaUrl(url);
            estudio.setMarcaDaguaPublicId(publicId);
            estudio.setMarcaDaguaAtiva(true);

            garantirPadroes(estudio);

            configuracaoEstudioRepository.save(estudio);

            return toDTO(estudio);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Não foi possível enviar a marca d'água"
            );
        }
    }

    @Transactional
    public MarcaDaguaConfigDTO removerImagemMarcaDagua() {
        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

        try {
            if (estudio.getMarcaDaguaPublicId() != null && !estudio.getMarcaDaguaPublicId().isBlank()) {
                cloudinaryService.deletar(estudio.getMarcaDaguaPublicId());
            }

            estudio.setMarcaDaguaUrl(null);
            estudio.setMarcaDaguaPublicId(null);
            estudio.setMarcaDaguaAtiva(false);

            configuracaoEstudioRepository.save(estudio);

            return toDTO(estudio);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Não foi possível remover a marca d'água"
            );
        }
    }

    @Transactional
    public MarcaDaguaReprocessarResponse reprocessarFotosExistentes() {
        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

        List<Foto> fotos = fotoRepository.findAll();

        int total = 0;

        for (Foto foto : fotos) {
            if (foto.getUrlOriginal() == null || foto.getUrlOriginal().isBlank()) {
                continue;
            }

            String urlWatermark = gerarUrlComMarcaDagua(foto.getUrlOriginal(), estudio);
            foto.setUrlWatermark(urlWatermark);
            total++;
        }

        fotoRepository.saveAll(fotos);

        return MarcaDaguaReprocessarResponse.builder()
                .totalFotosReprocessadas(total)
                .mensagem(total + " foto(s) reprocessada(s) com sucesso.")
                .build();
    }

    @Transactional(readOnly = true)
    public String gerarUrlComMarcaDagua(String urlOriginal) {
        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

        return gerarUrlComMarcaDagua(urlOriginal, estudio);
    }

    public String gerarUrlComMarcaDagua(String urlOriginal, ConfiguracaoEstudio estudio) {
        if (urlOriginal == null || urlOriginal.isBlank()) {
            return urlOriginal;
        }

        if (estudio == null) {
            return urlOriginal;
        }

        if (!Boolean.TRUE.equals(estudio.getMarcaDaguaAtiva())) {
            return urlOriginal;
        }

        if (estudio.getMarcaDaguaPublicId() == null || estudio.getMarcaDaguaPublicId().isBlank()) {
            return urlOriginal;
        }

        if (!urlOriginal.contains("/upload/")) {
            return urlOriginal;
        }

        String overlayPublicId = prepararPublicIdOverlay(estudio.getMarcaDaguaPublicId());
        String gravidade = mapearGravidade(estudio.getMarcaDaguaPosicao());
        int largura = mapearLargura(estudio.getMarcaDaguaTamanho());
        int opacidade = estudio.getMarcaDaguaOpacidade() == null ? 35 : estudio.getMarcaDaguaOpacidade();
        int margem = estudio.getMarcaDaguaMargem() == null ? 30 : estudio.getMarcaDaguaMargem();

        String transformacao = String.format(
                "/upload/l_%s,w_%d,o_%d,g_%s,x_%d,y_%d/",
                overlayPublicId,
                largura,
                opacidade,
                gravidade,
                margem,
                margem
        );

        return urlOriginal.replace("/upload/", transformacao);
    }

    private void garantirPadroes(ConfiguracaoEstudio estudio) {
        if (estudio.getMarcaDaguaPosicao() == null) {
            estudio.setMarcaDaguaPosicao(MarcaDaguaPosicao.INFERIOR_DIREITA);
        }

        if (estudio.getMarcaDaguaTamanho() == null) {
            estudio.setMarcaDaguaTamanho(MarcaDaguaTamanho.MEDIA);
        }

        if (estudio.getMarcaDaguaOpacidade() == null) {
            estudio.setMarcaDaguaOpacidade(35);
        }

        if (estudio.getMarcaDaguaMargem() == null) {
            estudio.setMarcaDaguaMargem(30);
        }
    }

    private String prepararPublicIdOverlay(String publicId) {
        return publicId.replace("/", ":");
    }

    private String mapearGravidade(MarcaDaguaPosicao posicao) {
        if (posicao == null) {
            return "south_east";
        }

        return switch (posicao) {
            case SUPERIOR_ESQUERDA -> "north_west";
            case SUPERIOR_DIREITA -> "north_east";
            case CENTRO -> "center";
            case INFERIOR_ESQUERDA -> "south_west";
            case INFERIOR_DIREITA -> "south_east";
        };
    }

    private int mapearLargura(MarcaDaguaTamanho tamanho) {
        if (tamanho == null) {
            return 250;
        }

        return switch (tamanho) {
            case PEQUENA -> 160;
            case MEDIA -> 250;
            case GRANDE -> 360;
        };
    }

    private Fotografa getFotografaLogada() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return fotografaRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Fotógrafa autenticada não encontrada"
                ));
    }

    private ConfiguracaoEstudio getOuCriarEstudio(Fotografa fotografa) {
        return configuracaoEstudioRepository.findByFotografaId(fotografa.getId())
                .orElseGet(() -> configuracaoEstudioRepository.save(
                        ConfiguracaoEstudio.builder()
                                .fotografa(fotografa)
                                .nomeEstudio("Olhari Fotografia")
                                .nomeComercial("Olhari")
                                .email(fotografa.getEmail())
                                .telefone(fotografa.getTelefone())
                                .cnpj(fotografa.getCnpj())
                                .logoUrl(fotografa.getLogoUrl())
                                .marcaDaguaAtiva(false)
                                .marcaDaguaPosicao(MarcaDaguaPosicao.INFERIOR_DIREITA)
                                .marcaDaguaOpacidade(35)
                                .marcaDaguaTamanho(MarcaDaguaTamanho.MEDIA)
                                .marcaDaguaMargem(30)
                                .build()
                ));
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

    private MarcaDaguaConfigDTO toDTO(ConfiguracaoEstudio estudio) {
        garantirPadroes(estudio);

        return MarcaDaguaConfigDTO.builder()
                .marcaDaguaUrl(estudio.getMarcaDaguaUrl())
                .marcaDaguaPublicId(estudio.getMarcaDaguaPublicId())
                .marcaDaguaAtiva(estudio.getMarcaDaguaAtiva())
                .marcaDaguaPosicao(estudio.getMarcaDaguaPosicao())
                .marcaDaguaOpacidade(estudio.getMarcaDaguaOpacidade())
                .marcaDaguaTamanho(estudio.getMarcaDaguaTamanho())
                .marcaDaguaMargem(estudio.getMarcaDaguaMargem())
                .build();
    }
}