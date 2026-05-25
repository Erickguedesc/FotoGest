package com.olhari.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomepageCursoRequest {

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotBlank(message = "Imagem é obrigatória")
    private String imagemUrl;

    private String imagemPublicId;

    private String precoTexto;

    @NotBlank(message = "Link externo é obrigatório")
    private String linkExterno;

    private String textoBotao;

    private Boolean ativo;

    private Integer ordem;
}
