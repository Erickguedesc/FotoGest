package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomepageCursoResponse {
    private UUID id;
    private String titulo;
    private String descricao;
    private String imagemUrl;
    private String precoTexto;
    private String linkExterno;
    private String textoBotao;
    private Boolean ativo;
    private Integer ordem;
    private OffsetDateTime criadoEm;
    private OffsetDateTime atualizadoEm;
}
