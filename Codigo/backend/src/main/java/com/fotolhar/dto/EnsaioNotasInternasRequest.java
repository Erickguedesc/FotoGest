package com.fotolhar.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnsaioNotasInternasRequest {

    @Size(max = 1000, message = "Notas internas deve ter no maximo 1000 caracteres")
    private String notasInternas;
}
