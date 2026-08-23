package com.fotolhar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModeloContratoRequest {

    @NotBlank(message = "Informe o nome do modelo")
    @Size(max = 140, message = "O nome deve ter no maximo 140 caracteres")
    private String nome;

    private String tipoEnsaio;

    @NotBlank(message = "Informe as clausulas do modelo")
    private String clausulas;

    private String textoAceite;

    private Boolean padrao;

    private Boolean ativo;
}
