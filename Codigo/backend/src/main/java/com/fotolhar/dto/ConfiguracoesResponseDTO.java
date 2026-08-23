package com.fotolhar.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracoesResponseDTO {
    private UsuarioConfigDTO usuario;
    private EstudioConfigDTO estudio;
    private PreferenciasConfigDTO preferencias;
    private MarcaDaguaConfigDTO marcaDagua;
    private EmailConfigDTO email;
    private List<ModeloContratoDTO> modelosContrato;
    private Boolean onboardingConcluido;
    private java.time.OffsetDateTime onboardingConcluidoEm;
}
