package com.fotolhar.dto;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModeloContratoDTO {
    private UUID id;
    private String nome;
    private String tipoEnsaio;
    private String clausulas;
    private String textoAceite;
    private Boolean padrao;
    private Boolean ativo;
    private OffsetDateTime atualizadoEm;
}
