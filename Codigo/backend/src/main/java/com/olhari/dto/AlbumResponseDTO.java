package com.olhari.dto;

import lombok.AllArgsConstructor; // Adicione isso
import lombok.Getter;
import lombok.NoArgsConstructor; // Adicione isso

@Getter
@AllArgsConstructor // <-- ESSENCIAL
@NoArgsConstructor  // <-- BOA PRÁTICA
public class AlbumResponseDTO {
    private String urlAcesso;
    private String senhaAcesso;
}