package com.olhari.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SolicitacaoRequest {

    @NotBlank(message = "Nome do cliente é obrigatório")
    private String nomeCliente;

    @NotBlank(message = "WhatsApp é obrigatório")
    private String whatsapp;

    @NotBlank(message = "Tipo de ensaio é obrigatório")
    private String tipoEnsaio;

    private LocalDate dataDesejada;
}