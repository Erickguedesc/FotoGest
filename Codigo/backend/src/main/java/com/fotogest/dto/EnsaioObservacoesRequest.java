package com.fotogest.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnsaioObservacoesRequest {

    @Size(max = 1000, message = "Observacoes deve ter no maximo 1000 caracteres")
    private String observacoes;
}
