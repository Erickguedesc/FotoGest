package com.olhari.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.olhari.model.HomepageConfig;
import com.olhari.repository.HomepageConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HomepageConfigService {

    private static final String EMPTY_CONFIG = "{}";

    private final HomepageConfigRepository repository;
    private final ObjectMapper objectMapper;

    public Map<String, Object> buscar() {
        return toMap(getOrCreate().getDadosJson());
    }

    public Map<String, Object> atualizar(Map<String, Object> dados) {
        HomepageConfig config = getOrCreate();
        config.setDadosJson(toJson(dados));
        return toMap(repository.save(config).getDadosJson());
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
}
