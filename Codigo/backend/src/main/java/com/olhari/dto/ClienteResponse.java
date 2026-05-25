package com.olhari.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ClienteResponse {
    private UUID id;
    private String nome;
    private String email;
    private String telefone;
    private String cpf;
    private String cidade;
    private String indicacao;
    private Boolean ativo;
}
