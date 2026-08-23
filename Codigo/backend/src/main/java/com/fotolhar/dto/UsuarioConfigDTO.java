package com.fotolhar.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioConfigDTO {
    private UUID id;
    private String nome;
    private String email;
    private String telefone;
    private String cidade;
    private String fotoPerfilUrl;
}