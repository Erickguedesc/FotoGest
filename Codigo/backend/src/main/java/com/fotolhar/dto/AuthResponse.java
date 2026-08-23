package com.fotolhar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String nome;
    private String email;
    private String nomeExibicao;
    private String nomeEstudio;
    private String nomeComercial;
    private Boolean onboardingConcluido;
}
