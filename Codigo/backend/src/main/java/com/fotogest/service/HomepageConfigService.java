package com.fotogest.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fotogest.model.HomepageConfig;
import com.fotogest.repository.HomepageConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HomepageConfigService {

    private static final String EMPTY_CONFIG = "{}";
    private static final String HOMEPAGE_FOLDER = "olhari/configuracoes/homepage/";

    private final HomepageConfigRepository repository;
    private final ObjectMapper objectMapper;
    private final CloudinaryService cloudinaryService;

    public Map<String, Object> buscar() {
        return toMap(getOrCreate().getDadosJson());
    }

    public Map<String, Object> atualizar(Map<String, Object> dados) {
        HomepageConfig config = getOrCreate();
        Map<String, Object> dadosAnteriores = toMap(config.getDadosJson());

        config.setDadosJson(toJson(dados));
        Map<String, Object> dadosSalvos = toMap(repository.save(config).getDadosJson());

        removerImagensSubstituidas(dadosAnteriores, dadosSalvos);

        return dadosSalvos;
    }

    public Map<String, String> uploadImagem(MultipartFile arquivo) {
        validarImagem(arquivo);

        try {
            Map<String, Object> uploadResult =
                    cloudinaryService.uploadConfiguracao(arquivo, "homepage");

            Object url = uploadResult.get("secure_url");
            Object publicId = uploadResult.get("public_id");

            if (!(url instanceof String) || !(publicId instanceof String)) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Resposta invalida do Cloudinary"
                );
            }

            Map<String, String> response = new LinkedHashMap<>();
            response.put("url", (String) url);
            response.put("publicId", (String) publicId);

            return response;
        } catch (IOException error) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Nao foi possivel enviar a imagem da homepage"
            );
        }
    }

    private HomepageConfig getOrCreate() {
        return repository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> repository.save(
                        HomepageConfig.builder()
                                .dadosJson(EMPTY_CONFIG)
                                .build()
                ));
    }

    private Map<String, Object> toMap(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<LinkedHashMap<String, Object>>() {});
        } catch (JsonProcessingException error) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Configuração da homepage inválida"
            );
        }
    }

    private String toJson(Map<String, Object> dados) {
        try {
            return objectMapper.writeValueAsString(dados);
        } catch (JsonProcessingException error) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não foi possível salvar a configuração da homepage"
            );
        }
    }

    private void validarImagem(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Arquivo de imagem invalido"
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
                    "Formato invalido. Envie apenas JPG, PNG ou WEBP"
            );
        }
    }

    private void removerImagensSubstituidas(
            Map<String, Object> dadosAnteriores,
            Map<String, Object> dadosNovos
    ) {
        Set<String> publicIdsNovos = coletarHomepagePublicIds(dadosNovos);

        coletarHomepagePublicIds(dadosAnteriores)
                .stream()
                .filter(publicId -> !publicIdsNovos.contains(publicId))
                .forEach(this::deletarImagemSemInterromper);
    }

    private Set<String> coletarHomepagePublicIds(Map<String, Object> dados) {
        Set<String> publicIds = new HashSet<>();

        adicionarPublicId(publicIds, dados.get("sobreImagemPublicId"));

        Object portfolioFotos = dados.get("portfolioFotos");
        if (portfolioFotos instanceof List<?> fotos) {
            fotos.forEach((foto) -> {
                if (foto instanceof Map<?, ?> fotoMap) {
                    adicionarPublicId(publicIds, fotoMap.get("publicId"));
                }
            });
        }

        return publicIds;
    }

    private void adicionarPublicId(Set<String> publicIds, Object value) {
        if (value instanceof String publicId && isHomepagePublicId(publicId)) {
            publicIds.add(publicId);
        }
    }

    private boolean isHomepagePublicId(String publicId) {
        return publicId != null && publicId.startsWith(HOMEPAGE_FOLDER);
    }

    private void deletarImagemSemInterromper(String publicId) {
        try {
            cloudinaryService.deletar(publicId);
        } catch (IOException ignored) {
            // A homepage ja foi salva; falha ao limpar Cloudinary nao deve quebrar o fluxo.
        }
    }
}
