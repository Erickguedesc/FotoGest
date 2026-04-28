package com.olhari.dto;

import com.olhari.enums.StatusEnsaio;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnsaioStatusRequest {

    @NotNull(message = "Status é obrigatório")
    private StatusEnsaio status;
}